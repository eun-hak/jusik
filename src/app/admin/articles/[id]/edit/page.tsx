import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/db/articles";
import ArticleForm from "@/components/admin/ArticleForm";

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
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-medium text-black">글 수정</h1>
        <p className="font-body text-sm text-gray-500 mt-1 line-clamp-1">{article.title}</p>
      </div>
      <ArticleForm initial={article} />
    </div>
  );
}
