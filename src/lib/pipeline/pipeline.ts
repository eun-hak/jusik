import { callLLM, extractJSON } from "./llm";
import { PLANNER_SYSTEM, plannerUserPrompt } from "./prompts/planner";
import { RESEARCHER_SYSTEM, researcherUserPrompt } from "./prompts/researcher";
import { WRITER_SYSTEM, writerUserPrompt } from "./prompts/writer";
import { EDITOR_SYSTEM, editorUserPrompt } from "./prompts/editor";
import { generateArticleImage } from "./image";
import { pickNextTopic, markTopicUsed } from "./topics";
import { createArticle, updateArticle, getArticles } from "../db/articles";
import type { PlanResult, ArticleDraft } from "./types";
import type { ContentBlock } from "../db/types";

export interface PipelineResult {
  articleId: string;
  title: string;
  slug: string;
  topic: string;
  steps: { step: string; durationMs: number }[];
}

async function runStep<T>(
  name: string,
  fn: () => Promise<T>,
  steps: PipelineResult["steps"],
): Promise<T> {
  const start = Date.now();
  console.log(`[pipeline] ${name} 시작...`);
  const result = await fn();
  const durationMs = Date.now() - start;
  console.log(`[pipeline] ${name} 완료 (${(durationMs / 1000).toFixed(1)}s)`);
  steps.push({ step: name, durationMs });
  return result;
}

export async function runPipeline(): Promise<PipelineResult> {
  const steps: PipelineResult["steps"] = [];

  const topic = pickNextTopic();
  if (!topic) throw new Error("사용 가능한 주제가 없습니다. .pipeline-topics.json에 주제를 추가해주세요.");

  const existingTitles = getArticles({ status: "published" }).map((a) => a.title);

  // 1. 기획
  const plan = await runStep("1/5 기획", async () => {
    const raw = await callLLM({
      tier: "fast",
      system: PLANNER_SYSTEM,
      user: plannerUserPrompt(topic, existingTitles),
      maxTokens: 2000,
    });
    return extractJSON<PlanResult>(raw);
  }, steps);

  // 2. 학습/리서치
  const research = await runStep("2/5 학습", async () => {
    return callLLM({
      tier: "fast",
      system: RESEARCHER_SYSTEM,
      user: researcherUserPrompt(plan),
      maxTokens: 4000,
    });
  }, steps);

  // 3. 작성
  const draft = await runStep("3/5 작성", async () => {
    const raw = await callLLM({
      tier: "quality",
      system: WRITER_SYSTEM,
      user: writerUserPrompt(plan, research),
      maxTokens: 10000,
      temperature: 0.75,
    });
    return extractJSON<ArticleDraft>(raw);
  }, steps);

  // 4. 검수
  const final = await runStep("4/5 검수", async () => {
    const raw = await callLLM({
      tier: "quality",
      system: EDITOR_SYSTEM,
      user: editorUserPrompt(draft),
      maxTokens: 10000,
      temperature: 0.5,
    });
    return extractJSON<ArticleDraft>(raw);
  }, steps);

  // ContentBlock 변환 (id 부여)
  const slug = final.slug || plan.slug;
  const ts = Date.now();
  const content: ContentBlock[] = final.content.map((block, i) => ({
    id: `auto-${ts}-${i}`,
    type: block.type as ContentBlock["type"],
    text: block.text,
  }));

  // 날짜 생성
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
  const isoStr = now.toISOString();

  // 읽는 시간 계산
  const totalChars = content.reduce((sum, b) => sum + (b.text?.length ?? 0), 0);
  const readMinutes = Math.max(3, Math.ceil(totalChars / 400));

  // 글 먼저 저장 → ID 확보
  const article = createArticle({
    slug,
    title: final.title,
    subtitle: final.subtitle,
    description: final.description,
    category: plan.category || topic.category,
    date: dateStr,
    publishedTime: isoStr,
    readTime: final.readTime || `${readMinutes}분`,
    author: "주식일기",
    content,
    tags: final.tags ?? [],
    status: "published",
  });

  // 5. 이미지 생성 (파일명 = 글 ID)
  try {
    const imageUrl = await runStep("5/5 이미지", async () => {
      return generateArticleImage({
        title: final.title,
        category: plan.category || topic.category,
        slug: article.id,
        description: topic.description,
      });
    }, steps);

    // 이미지 블록을 도입부 뒤(첫 번째 h2 앞)에 삽입
    const firstH2 = content.findIndex((b) => b.type === "h2");
    const insertAt = firstH2 > 0 ? firstH2 : Math.min(3, content.length);
    content.splice(insertAt, 0, {
      id: `auto-${ts}-img`,
      type: "image",
      text: "",
      imageUrl,
      imageCaption: final.subtitle?.split(".")[0] || final.title,
      imageContain: true,
    });

    updateArticle(article.id, { imageUrl, content });
  } catch (err) {
    console.warn("[pipeline] 이미지 생성 실패, 이미지 없이 진행:", err instanceof Error ? err.message : err);
  }

  markTopicUsed(topic.id);

  const totalMs = steps.reduce((s, st) => s + st.durationMs, 0);
  console.log(`[pipeline] 완료! "${article.title}" (총 ${(totalMs / 1000).toFixed(1)}s)`);

  return {
    articleId: article.id,
    title: article.title,
    slug: article.slug,
    topic: topic.keyword,
    steps,
  };
}
