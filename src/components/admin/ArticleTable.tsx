"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Article } from "@/lib/db/types";

interface Props {
  articles: Article[];
}

export default function ArticleTable({ articles }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 글을 삭제할까요?`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <p className="font-heading text-xl text-gray-300 mb-2">아직 글이 없습니다</p>
        <p className="font-body text-sm text-gray-400 mb-6">첫 번째 글을 작성해보세요.</p>
        <Link
          href="/admin/articles/new"
          className="font-body text-sm bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + 새 글 쓰기
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-50">
            <th className="px-5 py-3 text-left font-body text-[11px] font-semibold text-gray-400 tracking-widest uppercase">제목</th>
            <th className="px-5 py-3 text-left font-body text-[11px] font-semibold text-gray-400 tracking-widest uppercase hidden md:table-cell">카테고리</th>
            <th className="px-5 py-3 text-left font-body text-[11px] font-semibold text-gray-400 tracking-widest uppercase hidden md:table-cell">날짜</th>
            <th className="px-5 py-3 text-left font-body text-[11px] font-semibold text-gray-400 tracking-widest uppercase">상태</th>
            <th className="px-5 py-3 text-right font-body text-[11px] font-semibold text-gray-400 tracking-widest uppercase">액션</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, i) => (
            <tr key={article.id} className={`${i !== 0 ? "border-t border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}>
              <td className="px-5 py-4">
                <p className="font-body text-sm text-black font-medium line-clamp-1 max-w-xs">
                  {article.title}
                </p>
              </td>
              <td className="px-5 py-4 hidden md:table-cell">
                <span className="font-body text-xs text-[#6B2D3C] font-medium">
                  {article.category}
                </span>
              </td>
              <td className="px-5 py-4 hidden md:table-cell">
                <span className="font-body text-xs text-gray-400">{article.date}</span>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`font-body text-[11px] px-2.5 py-1 rounded-full ${
                    article.status === "published"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {article.status === "published" ? "발행됨" : "초안"}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3 justify-end">
                  {article.status === "published" && (
                    <Link
                      href={`/article/${article.slug}`}
                      target="_blank"
                      className="font-body text-xs text-gray-400 hover:text-black transition-colors"
                    >
                      보기
                    </Link>
                  )}
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="font-body text-xs text-gray-600 hover:text-black transition-colors"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    disabled={deletingId === article.id}
                    className="font-body text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                  >
                    {deletingId === article.id ? "삭제 중..." : "삭제"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
