import { Metadata } from "next";
import { getArticles } from "@/lib/db/articles";
import { SITE_URL } from "@/lib/config";
import SearchClient from "@/app/search/SearchClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "검색 | 주식일기",
  description: "주식일기의 모든 글을 검색하세요. 주식, 투자, 시장 분석 관련 글을 찾아보세요.",
  alternates: {
    canonical: `${SITE_URL}/search`,
  },
};

export default function SearchPage() {
  const articles = getArticles({ status: "published" }).map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.subtitle,
    date: a.date,
    category: a.category,
    readTime: a.readTime,
    imageUrl: a.imageUrl,
  }));

  return <SearchClient articles={articles} />;
}
