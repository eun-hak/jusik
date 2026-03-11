import Link from "next/link";
import { getArticles } from "@/lib/db/articles";
import ArticleTable from "@/components/admin/ArticleTable";

export const dynamic = "force-dynamic";

export default function AdminArticlesPage() {
  const articles = getArticles();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-medium text-black">글 관리</h1>
          <p className="font-body text-sm text-gray-500 mt-1">총 {articles.length}개</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="font-body text-sm bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + 새 글 쓰기
        </Link>
      </div>

      <ArticleTable articles={articles} />
    </div>
  );
}
