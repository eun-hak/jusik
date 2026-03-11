import { NextRequest, NextResponse } from "next/server";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/db/articles";
import type { ArticleUpdate } from "@/lib/db/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body: ArticleUpdate = await request.json();
    const article = updateArticle(id, body);
    if (!article) return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "글 수정에 실패했습니다." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = deleteArticle(id);
  if (!ok) return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
