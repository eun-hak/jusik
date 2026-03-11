"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "로그인에 실패했습니다.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 bg-[#6B2D3C] rounded-lg flex items-center justify-center">
            <span className="font-heading text-white text-base font-semibold">주</span>
          </div>
          <div>
            <p className="font-heading text-xl font-medium text-black">주식일기</p>
            <p className="font-body text-xs text-gray-500">관리자 로그인</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-medium text-gray-600">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
              className="font-body text-sm text-black border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-xs font-medium text-gray-600">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="font-body text-sm text-black border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="font-body text-sm font-medium bg-black text-white rounded-lg py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="font-body text-xs text-center text-gray-400 mt-4">
          기본 계정: admin@example.com / password
        </p>
      </div>
    </div>
  );
}
