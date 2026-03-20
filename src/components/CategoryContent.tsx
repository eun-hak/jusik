"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl?: string;
  subTags?: string[];
}

interface CategoryContentProps {
  tags: string[];
  articles: Article[];
}

export default function CategoryContent({ tags, articles }: CategoryContentProps) {
  const [activeTag, setActiveTag] = useState("전체");
  const [sortOrder, setSortOrder] = useState<"latest" | "popular">("latest");

  const filteredArticles =
    activeTag === "전체"
      ? articles
      : articles.filter((a) => a.subTags?.includes(activeTag));

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
            className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
              activeTag === tag
                ? "bg-black text-white border-black"
                : "border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Sort + Count */}
      <div className="flex items-center justify-between mt-8 mb-0">
        <p className="font-body text-sm text-gray-500">
          총 <span className="text-black font-medium">{filteredArticles.length}</span>개의 글
        </p>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "latest" | "popular")}
          className="font-body text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none"
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
        </select>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="flex flex-col gap-0">
          {filteredArticles.map((article) => (
            <Link key={article.slug} href={`/article/${article.slug}`} className="group">
              <article className="flex items-start gap-3 py-7 max-[360px]:py-5 border-t border-gray-200 last:border-b md:gap-6">
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                    <span className="font-body text-xs text-gray-500">{article.date}</span>
                    <span className="text-gray-200">·</span>
                    <span className="font-body text-xs text-burgundy font-medium">
                      {article.category}
                    </span>
                    <span className="text-gray-200">·</span>
                    <span className="font-body text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  <h2 className="font-heading text-lg max-[360px]:text-base md:text-2xl font-medium text-black leading-snug break-keep [overflow-wrap:anywhere] group-hover:text-burgundy transition-colors">
                    {article.title}
                  </h2>
                  <p className="font-body text-[13px] md:text-sm text-gray-600 leading-relaxed line-clamp-2 break-keep [overflow-wrap:anywhere]">
                    {article.excerpt}
                  </p>
                </div>
                {article.imageUrl && (
                  <div className="relative w-24 h-20 md:w-40 md:h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 gap-3 border-t border-gray-200 mt-0">
          <p className="font-heading text-xl font-medium text-black">준비 중입니다</p>
          <p className="font-body text-sm text-gray-500">
            해당 태그의 글이 곧 업로드될 예정입니다.
          </p>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1 mt-12">
        <button className="font-body text-sm text-gray-500 px-3 py-2 rounded hover:text-black transition-colors">
          ← 이전
        </button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`font-body text-sm w-9 h-9 rounded-md transition-colors ${
              p === 1 ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
        <button className="font-body text-sm text-gray-500 px-3 py-2 rounded hover:text-black transition-colors">
          다음 →
        </button>
      </div>
    </>
  );
}
