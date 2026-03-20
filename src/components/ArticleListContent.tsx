"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ArticleItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  imageUrl?: string;
}

interface ArticleListContentProps {
  articles: ArticleItem[];
}

const PAGE_SIZE = 10;

export default function ArticleListContent({ articles }: ArticleListContentProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      {/* Count */}
      <div className="flex items-center justify-between mt-0 mb-0">
        <p className="font-body text-sm text-gray-500">
          총 <span className="text-black font-medium">{articles.length}</span>개의 글
        </p>
      </div>

      {/* Article List */}
      {paginated.length > 0 ? (
        <div className="flex flex-col gap-0">
          {paginated.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="group block w-full min-w-0"
            >
              {/* 모바일: 이미지 위·텍스트 아래로 정렬해 좁은 폭에서 삐뚤어짐 방지 / md+: 가로 컴팩트 행 */}
              <article className="flex flex-col gap-3 py-5 border-t border-gray-200 last:border-b md:flex-row md:items-start md:gap-6 md:py-7">
                {article.imageUrl && (
                  <div className="relative h-[5.25rem] w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 md:h-28 md:w-40">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 160px"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-3">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
                    <span className="font-body tabular-nums">{article.date}</span>
                    {article.readTime && (
                      <>
                        <span className="text-gray-200" aria-hidden>
                          ·
                        </span>
                        <span className="font-body">{article.readTime}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-heading text-[17px] font-medium leading-snug text-black lining-nums [overflow-wrap:anywhere] group-hover:text-burgundy transition-colors md:text-2xl">
                    {article.title}
                  </h2>
                  <p className="font-body text-[13px] leading-relaxed text-gray-600 line-clamp-2 [overflow-wrap:anywhere] md:text-sm">
                    {article.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 gap-3 border-t border-gray-200 mt-0">
          <p className="font-heading text-xl font-medium text-black">글이 없습니다</p>
          <p className="font-body text-sm text-gray-500">아직 발행된 글이 없습니다.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="font-body text-sm text-gray-500 px-3 py-2 rounded hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`font-body text-sm w-9 h-9 rounded-md transition-colors ${
                p === currentPage ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="font-body text-sm text-gray-500 px-3 py-2 rounded hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      )}
    </>
  );
}
