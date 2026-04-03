"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

const recentSearches = ["PER", "EPS", "PBR", "금리", "실적"];

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  imageUrl?: string;
}

interface Props {
  articles: Article[];
}

export default function SearchClient({ articles }: Props) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    setSubmitted(true);
  };

  const results = submitted && query
    ? articles.filter(
        (a) =>
          a.title.includes(query) ||
          a.excerpt.includes(query) ||
          a.category.includes(query)
      )
    : [];

  return (
    <>
      {/* Search Hero */}
      <section className="bg-white py-14 md:py-20">
        <div className="container-desktop flex flex-col items-center gap-7">
          <h1 className="font-heading text-3xl md:text-5xl font-medium text-black text-center">
            무엇을 찾고 계신가요?
          </h1>

          {/* Search Input */}
          <div className="w-full max-w-2xl flex gap-2">
            <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-black transition-colors bg-white">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                placeholder="검색어를 입력하세요"
                className="flex-1 font-body text-sm text-black placeholder:text-gray-400 focus:outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={() => handleSearch(query)}
              className="btn-primary font-body text-sm px-5 py-3 rounded-lg flex-shrink-0"
            >
              검색
            </button>
          </div>

          {/* Recent Searches */}
          {!submitted && (
            <div className="flex flex-wrap justify-center gap-2">
              {recentSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="font-body text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2 hover:border-black hover:text-black transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* Results */}
      {submitted && (
        <section className="container-desktop py-10 md:py-14">
          <div className="flex items-center justify-between mb-8">
            <p className="font-body text-sm text-gray-600">
              <span className="font-medium text-black">&ldquo;{query}&rdquo;</span> 검색 결과{" "}
              <span className="font-medium text-black">{results.length}개</span>
            </p>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <Link key={article.slug} href={`/article/${article.slug}`} className="group">
                  <article className="flex flex-col gap-3 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                      {article.imageUrl ? (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                      <span className="absolute top-3 left-3 badge-burgundy text-[10px]">
                        {article.category}
                      </span>
                    </div>
                    <div className="px-4 pb-5 flex flex-col gap-2">
                      <h2 className="font-heading text-lg font-medium text-black leading-snug group-hover:text-burgundy transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="font-body text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body text-[11px] text-gray-400">{article.date}</span>
                        <span className="text-gray-300 text-[10px]">·</span>
                        <span className="font-body text-[11px] text-gray-400">{article.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center py-16 gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Search size={28} className="text-gray-300" />
              </div>
              <h2 className="font-heading text-xl font-medium text-black">
                다른 결과도 찾아보세요
              </h2>
              <p className="font-body text-sm text-gray-500 text-center max-w-sm leading-relaxed">
                검색어를 바꾸거나, 다른 키워드로 시도해 보세요.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="font-body text-sm text-gray-600 border border-gray-200 rounded-full px-4 py-2 hover:border-black hover:text-black transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
