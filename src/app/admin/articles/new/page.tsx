import ArticleForm from "@/components/admin/ArticleForm";

export const metadata = { title: "새 글 쓰기 | 관리자" };

export default function NewArticlePage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-medium text-black">새 글 쓰기</h1>
      </div>
      <ArticleForm />
    </div>
  );
}
