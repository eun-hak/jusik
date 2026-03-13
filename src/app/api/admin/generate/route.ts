import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const TONE_MAP: Record<string, string> = {
  analytical: "전문적이고 분석적인 톤. 데이터와 수치를 활용하고 논리적으로 전개.",
  educational: "쉽고 친근한 설명체. 초보 투자자도 이해할 수 있도록 용어를 풀어서 설명.",
  news: "신문 기사처럼 간결하고 사실 중심. 핵심 내용을 빠르게 전달.",
  opinion: "개인 투자자 관점의 의견과 경험을 담은 에세이 스타일.",
};

const LENGTH_MAP: Record<string, string> = {
  short: "짧게 (약 600자, 블록 5~7개)",
  medium: "보통 (약 1200자, 블록 10~13개)",
  long: "길게 (약 2000자, 블록 16~20개)",
};

export async function POST(request: NextRequest) {
  try {
    const { topic, keywords, category, tone, length } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "주제를 입력해주세요." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "여기에_새_키_입력") {
      return NextResponse.json(
        { error: "OPENAI_API_KEY가 설정되지 않았습니다. .env.local을 확인해주세요." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const systemPrompt = `당신은 주식 투자 블로그 "주식일기"의 전문 콘텐츠 작성자입니다.
투자자들이 실질적으로 도움 받을 수 있는 양질의 한국어 글을 작성합니다.
반드시 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 반환하세요.`;

    const userPrompt = `다음 조건으로 블로그 글을 작성해주세요.

주제: ${topic}
카테고리: ${category}
키워드: ${keywords || "없음"}
톤/스타일: ${TONE_MAP[tone] ?? TONE_MAP.analytical}
분량: ${LENGTH_MAP[length] ?? LENGTH_MAP.medium}

반환 형식 (순수 JSON, 마크다운 없이):
{
  "title": "블로그 글 제목 (클릭하고 싶은 매력적인 제목)",
  "subtitle": "부제목 (2~3문장, 글의 핵심 내용 요약)",
  "description": "SEO 설명 (검색 결과에 표시될 150자 이내 요약)",
  "slug": "영문-소문자-하이픈-구분-슬러그",
  "readTime": "읽는 시간 (예: 5분)",
  "tags": ["태그1", "태그2", "태그3", "태그4", "태그5"],
  "content": [
    { "type": "p", "text": "..." },
    { "type": "h2", "text": "..." },
    { "type": "h3", "text": "..." },
    { "type": "quote", "text": "..." }
  ]
}

규칙:
- content 블록 타입은 p(문단), h2(대제목), h3(소제목), quote(인용구) 4가지만 사용
- 글은 반드시 p 블록으로 시작
- h2로 섹션을 나누고 h3로 세부 항목을 구성
- quote는 핵심 수치나 전문가 의견을 강조할 때 사용
- 한국 주식 시장 맥락에 맞게 구체적인 내용 작성
- 모든 텍스트는 한국어로 작성 (slug만 영문)`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content ?? "{}";
    const generated = JSON.parse(raw);

    // content 블록에 id 부여
    if (Array.isArray(generated.content)) {
      generated.content = generated.content.map(
        (block: { type: string; text: string }, i: number) => ({
          id: `gen-${Date.now()}-${i}`,
          type: block.type,
          text: block.text,
        })
      );
    }

    return NextResponse.json({ generated });
  } catch (error) {
    console.error("[generate] error:", error);
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
