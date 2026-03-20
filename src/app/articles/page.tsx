import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { getArticles } from "@/lib/db/articles";
import ArticleListContent from "@/components/ArticleListContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "모든 글 | 주식일기",
  description: "주식일기의 모든 글을 한눈에 확인하세요.",
};

export default function ArticlesPage() {
  const articles = getArticles({ status: "published" }).map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.subtitle,
    date: a.date,
    readTime: a.readTime,
    imageUrl: a.imageUrl,
  }));

  return (
    <>
      <section className="bg-white pt-6 pb-4 md:pt-8">
        <div className="container-desktop py-6 md:py-8">
          <Link
            href="/"
            className="mb-6 inline-flex w-fit items-center gap-0.5 -ml-0.5 font-body text-[11px] text-gray-500 transition-colors hover:text-black"
            aria-label="홈으로"
          >
            <ChevronLeft className="size-3.5 shrink-0 opacity-70" aria-hidden />
            홈
          </Link>
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-4xl font-medium text-black md:text-5xl">
              모든 글
            </h1>
            <p className="max-w-lg font-body text-[15px] leading-relaxed text-gray-600">
              시장 분석부터 종목 탐구, 투자 전략까지. 모든 글을 한눈에 확인하세요.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="container-desktop py-10 md:py-14">
        <ArticleListContent articles={articles} />
      </section>
    </>
  );
}
