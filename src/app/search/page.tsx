"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

const recentSearches = ["반도체", "ETF", "삼성전자", "금리 인하", "포트폴리오"];

const allResults = [
  {
    slug: "2024-semiconductor-buy-now",
    title: "2024년 반도체 섹터, 지금 매수해도 될까?",
    excerpt: "AI 수요 폭증으로 반도체 업종이 다시 주목받고 있습니다. 삼성전자, SK하이닉스 밸류에이션 분석.",
    date: "2024.01.15",
    category: "분석",
    readTime: "8분",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  },
  {
    slug: "samsung-vs-tsmc-dividend",
    title: "삼성전자 vs TSMC, 반도체 패권 전쟁의 승자는?",
    excerpt: "파운드리 시장의 양강 구도가 굳어지는 가운데, 두 기업의 기술력과 수익성을 비교합니다.",
    date: "2024.01.12",
    category: "종목",
    readTime: "12분",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
  },
  {
    slug: "individual-investor-etf-portfolio",
    title: "초보 투자자를 위한 ETF 포트폴리오 구성법",
    excerpt: "변동성이 큰 시장에서 ETF로 분산 투자하는 방법을 단계별로 설명합니다.",
    date: "2024.01.10",
    category: "투자노트",
    readTime: "10분",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = (q: string) => {
    setQuery(q);
    setSubmitted(true);
  };

  const results = submitted && query
    ? allResults.filter(
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
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
              {["전체", "글", "목록"].map((v, i) => (
                <button
                  key={v}
                  className={`font-body text-xs px-3 py-2 transition-colors ${
                    i === 0 ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((article) => (
                <Link key={article.slug} href={`/article/${article.slug}`} className="group">
                  <article className="flex flex-col gap-3 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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
