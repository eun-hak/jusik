import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleById } from "@/lib/db/articles";
import ArticleForm from "@/components/admin/ArticleForm";
import ArticleDeleteButton from "@/components/admin/ArticleDeleteButton";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) notFound();

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium text-black">글 수정</h1>
          <p className="font-body text-sm text-gray-500 mt-1 line-clamp-1">{article.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="font-body text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← 목록
          </Link>
          <ArticleDeleteButton
            articleId={article.id}
            articleTitle={article.title}
            variant="danger"
          />
        </div>
      </div>
      <ArticleForm initial={article} />
    </div>
  );
}
