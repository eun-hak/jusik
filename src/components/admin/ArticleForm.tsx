"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Article, ContentBlock, ContentBlockType } from "@/lib/db/types";

const CATEGORIES = ["분석", "종목", "투자노트", "시장동향"];
const BLOCK_LABELS: Record<ContentBlockType, string> = {
  p: "문단",
  h2: "H2 제목",
  h3: "H3 소제목",
  quote: "인용구",
};

function newBlock(type: ContentBlockType = "p"): ContentBlock {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    type,
    text: "",
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface Props {
  initial?: Article;
}

export default function ArticleForm({ initial }: Props) {
  const router = useRouter();
  // AI 생성 글은 id가 비어 있으므로 새 글로 POST
  const isEdit = !!(initial?.id);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "분석");
  const [date, setDate] = useState(
    initial?.date ?? new Date().toLocaleDateString("ko-KR").replace(/\. /g, ".").replace(/\.$/, "")
  );
  const [readTime, setReadTime] = useState(initial?.readTime ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "주식일기");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initial?.content.length ? initial.content : [newBlock("p")]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = useCallback((v: string) => {
    setTitle(v);
    if (!slugManual) setSlug(slugify(v));
  }, [slugManual]);

  function addBlock(type: ContentBlockType, afterIdx?: number) {
    const block = newBlock(type);
    setBlocks((prev) => {
      const next = [...prev];
      if (afterIdx !== undefined) {
        next.splice(afterIdx + 1, 0, block);
      } else {
        next.push(block);
      }
      return next;
    });
  }

  function removeBlock(idx: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== idx));
  }

  function moveBlock(idx: number, dir: "up" | "down") {
    setBlocks((prev) => {
      const next = [...prev];
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function updateBlock(idx: number, patch: Partial<ContentBlock>) {
    setBlocks((prev) => prev.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  }

  async function handleSave(saveStatus: "draft" | "published") {
    if (!title.trim()) { setError("제목을 입력해주세요."); return; }
    if (!slug.trim()) { setError("슬러그를 입력해주세요."); return; }

    setSaving(true);
    setError("");

    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      category,
      date,
      publishedTime: new Date().toISOString(),
      readTime,
      author,
      imageUrl,
      content: blocks.filter((b) => b.text.trim()),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: saveStatus,
    };

    try {
      const url = isEdit
        ? `/api/admin/articles/${initial!.id}`
        : "/api/admin/articles";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("저장 실패");
      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 좌측: 에디터 */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* 제목 */}
        <div>
          <input
            type="text"
            placeholder="글 제목을 입력하세요"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full font-heading text-3xl font-medium text-black placeholder:text-gray-300 border-0 border-b-2 border-gray-100 focus:border-black outline-none pb-3 transition-colors bg-transparent"
          />
        </div>

        {/* 부제목 */}
        <textarea
          placeholder="부제목 (선택)"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={2}
          className="w-full font-body text-base text-gray-600 placeholder:text-gray-300 border-0 border-b border-gray-100 focus:border-gray-300 outline-none pb-3 resize-none bg-transparent transition-colors"
        />

        {/* 블록 에디터 */}
        <div className="flex flex-col gap-2 mt-2">
          <p className="font-body text-xs font-semibold text-gray-400 tracking-widest uppercase">본문</p>

          {blocks.map((block, idx) => (
            <div key={block.id} className="group flex gap-2 items-start">
              {/* 컨트롤 */}
              <div className="flex flex-col gap-0.5 pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  onClick={() => moveBlock(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-20 transition-colors"
                  title="위로"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => moveBlock(idx, "down")}
                  disabled={idx === blocks.length - 1}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-20 transition-colors"
                  title="아래로"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* 블록 본체 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <select
                    value={block.type}
                    onChange={(e) => updateBlock(idx, { type: e.target.value as ContentBlockType })}
                    className="font-body text-[11px] text-gray-400 border border-gray-200 rounded px-2 py-0.5 bg-white focus:outline-none focus:border-gray-400"
                  >
                    {(Object.entries(BLOCK_LABELS) as [ContentBlockType, string][]).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeBlock(idx)}
                    className="opacity-0 group-hover:opacity-100 font-body text-[11px] text-red-400 hover:text-red-600 transition-all"
                  >
                    삭제
                  </button>
                </div>
                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock(idx, { text: e.target.value })}
                  placeholder={
                    block.type === "p" ? "문단 내용을 입력하세요..." :
                    block.type === "h2" ? "H2 제목..." :
                    block.type === "h3" ? "H3 소제목..." : "인용구..."
                  }
                  rows={block.type === "p" ? 3 : 2}
                  className={`w-full font-body text-sm text-gray-700 border border-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:border-gray-300 resize-y bg-gray-50 transition-colors ${
                    block.type === "h2" ? "font-heading text-lg font-medium" :
                    block.type === "h3" ? "font-heading text-base font-medium" :
                    block.type === "quote" ? "italic border-l-4 border-l-[#6B2D3C] rounded-l-none pl-4" : ""
                  }`}
                />
              </div>
            </div>
          ))}

          {/* 블록 추가 버튼들 */}
          <div className="flex items-center gap-2 pt-2">
            <span className="font-body text-xs text-gray-400">블록 추가:</span>
            {(Object.entries(BLOCK_LABELS) as [ContentBlockType, string][]).map(([type, label]) => (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="font-body text-xs text-gray-500 border border-gray-200 rounded px-2.5 py-1 hover:border-gray-400 hover:text-black transition-colors"
              >
                + {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 우측: 메타데이터 */}
      <div className="w-full lg:w-[280px] flex-shrink-0">
        <div className="sticky top-4 flex flex-col gap-4">
          {/* 저장 버튼 */}
          {error && (
            <p className="font-body text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex-1 font-body text-sm py-2.5 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50"
            >
              초안 저장
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex-1 font-body text-sm py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? "저장 중..." : "발행"}
            </button>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 flex flex-col gap-4">
            <p className="font-body text-xs font-semibold text-gray-400 tracking-widest uppercase">메타데이터</p>

            {/* 슬러그 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">슬러그 (URL)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                placeholder="my-article-slug"
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* 설명 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">SEO 설명</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="검색 결과에 표시될 설명..."
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50 resize-none"
              />
            </div>

            {/* 카테고리 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* 날짜 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">날짜</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="2024.01.15"
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* 읽는 시간 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">읽는 시간</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="8분"
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* 저자 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">저자</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* 이미지 URL */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">대표 이미지 URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* 태그 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">태그 (쉼표로 구분)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="삼성전자, 반도체, AI"
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              />
            </div>

            {/* 상태 */}
            <div className="flex flex-col gap-1">
              <label className="font-body text-xs text-gray-500">상태</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="font-body text-xs text-gray-700 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-400 bg-gray-50"
              >
                <option value="draft">초안</option>
                <option value="published">발행됨</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
