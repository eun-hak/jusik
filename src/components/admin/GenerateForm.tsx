"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArticleForm from "./ArticleForm";
import type { Article } from "@/lib/db/types";

const CATEGORIES = ["분석", "종목", "투자노트", "시장동향"];

const TONES = [
  { value: "analytical", label: "분석형", desc: "데이터·수치 중심의 전문적인 글" },
  { value: "educational", label: "교육형", desc: "초보자도 이해하기 쉬운 설명체" },
  { value: "news", label: "뉴스형", desc: "간결하고 사실 중심의 기사체" },
  { value: "opinion", label: "의견형", desc: "투자자 관점의 에세이 스타일" },
];

const LENGTHS = [
  { value: "short", label: "짧게", desc: "~600자" },
  { value: "medium", label: "보통", desc: "~1200자" },
  { value: "long", label: "길게", desc: "~2000자" },
];

type GeneratedData = Omit<Article, "id" | "createdAt" | "updatedAt" | "date" | "publishedTime" | "author" | "imageUrl" | "status">;

export default function GenerateForm() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("분석");
  const [tone, setTone] = useState("analytical");
  const [length, setLength] = useState("medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<GeneratedData | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) {
      setError("주제를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    setGenerated(null);

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords, category, tone, length }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "생성 실패");

      setGenerated(data.generated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  // 생성된 데이터를 ArticleForm initial 형식으로 변환
  const initialArticle: Article | undefined = generated
    ? {
        id: "",
        slug: generated.slug ?? "",
        title: generated.title ?? "",
        subtitle: generated.subtitle ?? "",
        description: generated.description ?? "",
        category: generated.category ?? category,
        date: new Date().toLocaleDateString("ko-KR").replace(/\. /g, ".").replace(/\.$/, ""),
        publishedTime: new Date().toISOString(),
        readTime: generated.readTime ?? "",
        author: "주식일기",
        imageUrl: "",
        content: generated.content ?? [],
        tags: generated.tags ?? [],
        status: "draft",
        createdAt: "",
        updatedAt: "",
      }
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      {/* 입력 폼 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#6B2D3C] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h4M6 5l-4 3 4 3M10 8h4M10 5l4 3-4 3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-lg font-medium text-black">AI 글 생성 설정</h2>
            <p className="font-body text-xs text-gray-500">GPT-4o mini 기반으로 글을 자동 생성합니다</p>
          </div>
        </div>

        {/* 주제 */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm font-medium text-gray-700">
            주제 <span className="text-[#6B2D3C]">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="예: 삼성전자 2024년 하반기 실적 전망"
            className="font-body text-sm text-black border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* 키워드 */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm font-medium text-gray-700">
            키워드 <span className="font-body text-xs text-gray-400">(선택, 쉼표로 구분)</span>
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="예: HBM, 반도체, AI, 매수 시점"
            className="font-body text-sm text-black border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* 카테고리 */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm font-medium text-gray-700">카테고리</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`font-body text-sm px-4 py-2 rounded-lg border transition-colors ${
                  category === c
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 톤 */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm font-medium text-gray-700">글 스타일</label>
          <div className="grid grid-cols-2 gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`flex flex-col gap-0.5 text-left px-4 py-3 rounded-lg border transition-colors ${
                  tone === t.value
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className={`font-body text-sm font-medium ${tone === t.value ? "text-white" : "text-black"}`}>
                  {t.label}
                </span>
                <span className={`font-body text-xs ${tone === t.value ? "text-white/70" : "text-gray-400"}`}>
                  {t.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 길이 */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-sm font-medium text-gray-700">글 길이</label>
          <div className="flex gap-2">
            {LENGTHS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLength(l.value)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-3 rounded-lg border transition-colors ${
                  length === l.value
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className={`font-body text-sm font-medium ${length === l.value ? "text-white" : "text-black"}`}>
                  {l.label}
                </span>
                <span className={`font-body text-xs ${length === l.value ? "text-white/70" : "text-gray-400"}`}>
                  {l.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 에러 */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            <p className="font-body text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full font-body text-sm font-medium bg-[#6B2D3C] text-white rounded-lg py-3.5 hover:bg-[#5a2433] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              GPT-4o mini 생성 중... (10~30초 소요)
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1l1.8 4.2L14 8l-4.2 1.8L8 14l-1.8-4.2L2 8l4.2-1.8L8 1z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
              AI로 글 생성하기
            </>
          )}
        </button>
      </div>

      {/* 생성된 결과 */}
      {generated && initialArticle && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-body text-sm text-gray-700 font-medium">
              생성 완료! 아래에서 내용을 확인·수정한 뒤 발행하세요.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-green-100 ring-1 ring-green-100 p-6">
            <ArticleForm initial={initialArticle} />
          </div>

          <div className="flex gap-3 px-1">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="font-body text-sm border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
            >
              다시 생성
            </button>
            <button
              onClick={() => router.push("/admin/articles")}
              className="font-body text-sm text-gray-400 px-3 py-2.5 hover:text-black transition-colors"
            >
              목록으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
