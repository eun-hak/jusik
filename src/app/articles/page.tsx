import { Metadata } from "next";
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
      <section className="bg-white pt-10 pb-4">
        <div className="container-desktop flex flex-col items-center text-center gap-4 py-8">
          <h1 className="font-heading text-4xl md:text-5xl font-medium text-black">모든 글</h1>
          <p className="font-body text-[15px] text-gray-600 max-w-lg leading-relaxed">
            시장 분석부터 종목 탐구, 투자 전략까지. 모든 글을 한눈에 확인하세요.
          </p>
        </div>
      </section>

      <div className="divider" />

      <section className="container-desktop py-10 md:py-14">
        <ArticleListContent articles={articles} />
      </section>
    </>
  );
}
