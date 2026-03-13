import { readDb, writeDb } from "./mock";
import type { Article, ArticleInput, ArticleUpdate } from "./types";

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getArticles(opts?: { status?: "draft" | "published" }): Article[] {
  const db = readDb();
  const all = Array.from(db.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (opts?.status) return all.filter((a) => a.status === opts.status);
  return all;
}

export function getArticleById(id: string): Article | null {
  const db = readDb();
  return db.get(id) ?? null;
}

export function getArticleBySlug(slug: string): Article | null {
  const db = readDb();
  for (const a of db.values()) {
    if (a.slug === slug) return a;
  }
  return null;
}

export function createArticle(input: ArticleInput): Article {
  const db = readDb();
  const now = new Date().toISOString();
  const article: Article = {
    ...input,
    id: newId(),
    createdAt: now,
    updatedAt: now,
  };
  db.set(article.id, article);
  writeDb(db);
  return article;
}

export function updateArticle(id: string, update: ArticleUpdate): Article | null {
  const db = readDb();
  const existing = db.get(id);
  if (!existing) return null;
  const updated: Article = {
    ...existing,
    ...update,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  db.set(id, updated);
  writeDb(db);
  return updated;
}

export function deleteArticle(id: string): boolean {
  const db = readDb();
  const deleted = db.delete(id);
  if (deleted) writeDb(db);
  return deleted;
}

export function getStats() {
  const all = getArticles();
  return {
    total: all.length,
    published: all.filter((a) => a.status === "published").length,
    draft: all.filter((a) => a.status === "draft").length,
  };
}
