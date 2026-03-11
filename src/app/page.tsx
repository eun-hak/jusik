import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import Ticker from "@/components/Ticker";
import NewsletterForm from "@/components/NewsletterForm";
import { getArticles } from "@/lib/db/articles";

export const dynamic = "force-dynamic";

const popularArticles = [
  { slug: "kospi-2500-outlook", title: "KOSPI 2500 돌파, 지속 가능할까?" },
  { slug: "warren-buffett-2024", title: "버핏이 2024년 담은 종목 분석" },
  { slug: "us-rate-cut-impact", title: "미국 금리 인하가 국내 주식에 미치는 영향" },
  { slug: "secondary-battery-stocks", title: "2차전지 섹터 하락, 저가 매수 타이밍은?" },
  { slug: "dividend-strategy-2024", title: "배당주 투자 전략: 연 5% 수익 만들기" },
];

const categories = [
  { name: "분석", href: "/category/analysis", count: 24 },
  { name: "종목", href: "/category/stocks", count: 18 },
  { name: "투자노트", href: "/category/notes", count: 31 },
  { name: "시장동향", href: "/category/market", count: 12 },
];

const tags = [
  "ETF", "삼성전자", "반도체", "배당", "미국주식",
  "포트폴리오", "KOSPI", "금리", "가치투자", "성장주",
];

export default function HomePage() {
  const published = getArticles({ status: "published" });
  const latestArticles = published.slice(0, 4).map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.subtitle,
    date: a.date,
    category: a.category,
    readTime: a.readTime,
    imageUrl: a.imageUrl,
  }));

  return (
    <>
      {/* Ticker */}
      <Ticker />

      <div className="divider" />

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-desktop flex flex-col items-center text-center gap-6">
          <span className="badge-burgundy text-[11px] tracking-widest uppercase">블로그</span>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-[72px] font-medium text-black leading-tight max-w-3xl">
            주식 투자의 모든 것
          </h1>
          <p className="font-body text-[15px] md:text-base text-gray-600 leading-relaxed max-w-xl">
            시장 분석부터 종목 탐구, 투자 전략까지. 더 나은 투자 결정을 위한 인사이트를 전합니다.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Link
              href="/category/analysis"
              className="btn-primary font-body text-sm px-6 py-3 rounded-md"
            >
              최신글 보기
            </Link>
            <Link
              href="/newsletter"
              className="btn-secondary font-body text-sm px-6 py-3 rounded-md"
            >
              뉴스레터 구독
            </Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Content + Sidebar */}
      <section className="container-desktop py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Main: Article List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl font-medium text-black">최신 글</h2>
              <Link href="/category/analysis" className="font-body text-sm text-gray-500 hover:text-black transition-colors md:hidden">
                전체 보기 →
              </Link>
            </div>

            {latestArticles.length === 0 ? (
              <p className="font-body text-sm text-gray-400 py-8">아직 발행된 글이 없습니다.</p>
            ) : (
              <>
                {/* Mobile: featured + compact */}
                <div className="md:hidden flex flex-col gap-4">
                  <ArticleCard article={latestArticles[0]} variant="featured" />
                  {latestArticles.slice(1).map((article) => (
                    <ArticleCard key={article.slug} article={article} variant="compact" />
                  ))}
                </div>

                {/* Desktop: list */}
                <div className="hidden md:block">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.slug} article={article} variant="list" />
                  ))}
                </div>
              </>
            )}

            <div className="hidden md:block mt-6 pt-6 border-t border-gray-200">
              <Link href="/category/analysis" className="btn-secondary font-body text-sm px-6 py-3 rounded-md">
                더보기
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-10">

            {/* Popular Articles */}
            <div>
              <h3 className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500 mb-5">
                인기 글
              </h3>
              <ol className="flex flex-col gap-4">
                {popularArticles.map((article, i) => (
                  <li key={article.slug}>
                    <Link href={`/article/${article.slug}`} className="flex items-start gap-4 group">
                      <span className="font-heading text-2xl font-medium text-gray-200 leading-none w-7 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-body text-sm text-gray-700 leading-snug group-hover:text-black transition-colors">
                        {article.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500 mb-5">
                카테고리
              </h3>
              <ul className="flex flex-col">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <Link
                      href={cat.href}
                      className="flex items-center justify-between py-3 border-b border-gray-100 group"
                    >
                      <span className="font-body text-sm text-gray-700 group-hover:text-black transition-colors">
                        {cat.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-xs text-gray-400">{cat.count}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-300">
                          <path d="M5.5 3.5L8.5 7L5.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-burgundy rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-heading text-xl font-medium text-white leading-snug">
                매일 아침 인사이트를 받아보세요
              </h3>
              <p className="font-body text-sm text-white/70 leading-relaxed">
                주요 시장 동향과 핵심 종목 분석을 이메일로 전달해 드립니다.
              </p>
              <NewsletterForm variant="dark" />
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500 mb-4">
                태그
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="font-body text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 hover:text-black transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
