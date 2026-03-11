import { NextRequest, NextResponse } from "next/server";
import { getArticles, createArticle } from "@/lib/db/articles";
import type { ArticleInput } from "@/lib/db/types";

export async function GET() {
  const articles = getArticles();
  return NextResponse.json({ articles });
}

export async function POST(request: NextRequest) {
  try {
    const body: ArticleInput = await request.json();
    const article = createArticle(body);
    return NextResponse.json({ article }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "글 생성에 실패했습니다." }, { status: 400 });
  }
}
