import GenerateForm from "@/components/admin/GenerateForm";

export const metadata = { title: "AI 글 생성 | 관리자" };

export default function GeneratePage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium text-black">AI 글 생성</h1>
        <p className="font-body text-sm text-gray-500 mt-1">
          주제와 옵션을 설정하면 GPT-4o mini가 자동으로 글을 작성합니다
        </p>
      </div>
      <GenerateForm />
    </div>
  );
}
