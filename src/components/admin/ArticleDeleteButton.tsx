"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  articleId: string;
  articleTitle: string;
  variant?: "inline" | "danger";
}

export default function ArticleDeleteButton({
  articleId,
  articleTitle,
  variant = "inline",
}: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${articleTitle}" 글을 삭제할까요?\n삭제된 글은 복구할 수 없습니다.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${articleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      router.push("/admin/articles");
      router.refresh();
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  }

  if (variant === "danger") {
    return (
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="font-body text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50"
      >
        {deleting ? "삭제 중..." : "글 삭제"}
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="font-body text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
    >
      {deleting ? "삭제 중..." : "삭제"}
    </button>
  );
}
