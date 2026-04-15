import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const IMAGES_DIR = path.join(process.cwd(), "images");

function buildPrompt(title: string, description: string): string {
  return `한국어 금융 교육 블로그용 인포그래픽 이미지를 만들어줘.

주제: ${title}

이미지 내용 (반드시 한국어로 작성):
- 상단에 주제 제목을 한국어로 크게 배치
- 핵심 개념을 도형, 아이콘, 화살표로 시각화
- ${description}
- 각 요소에 한국어 라벨/설명 텍스트 포함
- 비교, 흐름도, 구조도 등 교육적 다이어그램 활용

디자인 스타일:
- 밝고 깔끔한 교육용 인포그래픽
- 파란색, 초록색, 회색 계열 전문적 컬러
- 흰색 또는 밝은 배경
- 아이콘과 도형 중심 시각화
- 전문적이면서도 이해하기 쉬운 레이아웃
- 사람 얼굴 없이 아이콘/심플 캐릭터만 사용`;
}

export async function generateArticleImage(opts: {
  title: string;
  category: string;
  slug: string;
  description?: string;
}): Promise<string> {
  const apiKey = process.env.GOGGLE_API_KEY;
  if (!apiKey) throw new Error("GOGGLE_API_KEY가 설정되지 않았습니다.");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: buildPrompt(opts.title, opts.description ?? opts.category),
    config: {
      responseModalities: ["IMAGE"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
  if (!imagePart?.inlineData?.data) {
    throw new Error("Gemini에서 이미지 데이터를 받지 못했습니다.");
  }

  const buffer = Buffer.from(imagePart.inlineData.data, "base64");

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const ext = imagePart.inlineData.mimeType === "image/jpeg" ? "jpg" : "png";
  const filePath = path.join(IMAGES_DIR, `${opts.slug}.${ext}`);
  fs.writeFileSync(filePath, buffer);

  execSync("yarn webp", { cwd: process.cwd(), stdio: "pipe" });

  const webpPath = path.join(process.cwd(), "public", "img", `${opts.slug}.webp`);
  if (!fs.existsSync(webpPath)) {
    throw new Error(`WebP 변환 실패: ${webpPath} 파일이 생성되지 않았습니다.`);
  }

  fs.unlinkSync(filePath);

  return `/img/${opts.slug}.webp`;
}
