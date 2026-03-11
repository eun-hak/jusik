"use client";

import { useState } from "react";

interface NewsletterFormProps {
  variant?: "default" | "dark";
}

export default function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // TODO: 실제 뉴스레터 서비스 API 연동 (예: Mailchimp, ConvertKit, Stibee)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-md px-4 py-3">
        <span className="text-green-500 text-base">✓</span>
        <p className="font-body text-sm text-green-800">
          구독 완료! 다음 뉴스레터를 기대해주세요.
        </p>
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          required
          className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2.5 font-body text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-white text-burgundy font-body text-sm font-semibold py-2.5 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "처리 중..." : "구독하기"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          required
          className="flex-1 border border-gray-200 rounded-md px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary font-body text-sm px-5 py-3 rounded-md flex-shrink-0 disabled:opacity-60"
        >
          {status === "loading" ? "..." : "구독하기"}
        </button>
      </div>
      <p className="font-body text-xs text-gray-400">
        언제든 구독 취소 가능합니다. 스팸 없음.
      </p>
    </form>
  );
}
