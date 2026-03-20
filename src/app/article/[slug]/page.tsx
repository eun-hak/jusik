import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import ArticleCard, { Article as CardArticle } from "@/components/ArticleCard";
import { getArticleBySlug, getArticles } from "@/lib/db/articles";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "글을 찾을 수 없습니다 | 주식일기" };

  return {
    title: `${article.title} | 주식일기`,
    description: article.description,
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedTime,
      authors: [article.author],
      url: `${SITE_URL}/article/${article.slug}`,
      ...(article.imageUrl && {
        images: [{ url: article.imageUrl, width: 1200, height: 630, alt: article.title }],
      }),
    },
    twitter: {
      card: article.imageUrl ? "summary_large_image" : "summary",
      title: article.title,
      description: article.description,
      ...(article.imageUrl && { images: [article.imageUrl] }),
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles: CardArticle[] = getArticles({ status: "published" })
    .filter((a) => a.slug !== slug)
    .slice(0, 3)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.subtitle,
      date: a.date,
      category: a.category,
      readTime: a.readTime,
      imageUrl: a.imageUrl,
    }));

  let headingCounter = 0;
  const headingIndexes = article.content.map((block) => {
    if (block.type === "h2" || block.type === "h3") return headingCounter++;
    return -1;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    ...(article.imageUrl && { image: article.imageUrl }),
    datePublished: article.publishedTime,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "주식일기",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/article/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article Header - 본문과 같은 컬럼에 맞춰 정렬 (데스크톱) */}
      <section className="bg-white pt-6 md:pt-8 pb-8 border-b border-gray-100">
        <div className="container-desktop">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="flex-1 min-w-0 max-w-[680px] flex flex-col gap-4">
              <Link
                href="/articles"
                className="inline-flex items-center gap-0.5 -ml-0.5 font-body text-[11px] text-gray-500 hover:text-black transition-colors w-fit"
                aria-label="글 목록으로"
              >
                <ChevronLeft className="size-3.5 shrink-0 opacity-70" aria-hidden />
                목록
              </Link>
              <span className="badge-burgundy text-[11px] tracking-widest uppercase self-start">
                {article.category}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-medium text-black leading-tight">
                {article.title}
              </h1>
              <p className="font-body text-[15px] text-gray-500 leading-relaxed">
                {article.subtitle}
              </p>
              <div className="flex items-center gap-3 pt-1 border-t border-gray-100 mt-1">
                <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-heading text-xs font-semibold">주</span>
                </div>
                <div className="flex items-center gap-2 font-body text-sm text-gray-500">
                  <span className="font-medium text-black">{article.author}</span>
                  <span className="text-gray-300">·</span>
                  <span>{article.date}</span>
                  <span className="text-gray-300">·</span>
                  <span>읽는 시간 {article.readTime}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-[260px] flex-shrink-0" aria-hidden />
          </div>
        </div>
      </section>

      {/* Article Body + Sidebar */}
      <section className="container-desktop py-12 md:py-16">
        {/* 모바일: 목차가 본문 위로 (DOM은 본문→사이드, column-reverse로 순서만 뒤집음) */}
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16">

          {/* Article Body */}
          <article className="flex-1 min-w-0 max-w-[680px]">
            {article.content.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={block.id}
                    id={`section-${headingIndexes[i]}`}
                    className="font-heading text-2xl md:text-3xl font-medium text-black mt-10 mb-4 first:mt-0 scroll-mt-24"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3
                    key={block.id}
                    id={`section-${headingIndexes[i]}`}
                    className="font-heading text-xl font-medium text-black mt-8 mb-3 scroll-mt-24"
                  >
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote key={block.id} className="border-l-4 border-burgundy pl-5 my-7">
                    <p className="font-body text-[15px] text-gray-700 leading-relaxed italic">
                      {block.text}
                    </p>
                  </blockquote>
                );
              }
              if (block.type === "image" && block.imageUrl) {
                return (
                  <figure key={block.id} className="my-6 max-w-2xl mx-auto">
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={block.imageUrl}
                        alt={block.imageCaption ?? block.text ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {block.imageCaption && (
                      <figcaption className="font-body text-xs text-gray-400 text-center mt-2">
                        {block.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return (
                <p key={block.id} className="font-body text-[15px] text-gray-700 leading-[1.9] mb-5">
                  {block.text}
                </p>
              );
            })}

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="font-body text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 hover:text-black transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[260px] flex-shrink-0">
            <div className="lg:sticky lg:top-8 flex flex-col gap-8">

              {/* Table of Contents */}
              <div>
                <h3 className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500 mb-3">
                  목차
                </h3>
                <ol className="flex flex-col gap-1.5">
                  {article.content
                    .map((b, idx) => ({ b, sectionIdx: headingIndexes[idx] }))
                    .filter(({ b }) => b.type === "h2")
                    .map(({ b, sectionIdx }, i) => (
                      <li key={b.id} className="flex items-start gap-2">
                        <span className="font-body text-[11px] text-gray-400 mt-0.5 flex-shrink-0 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <a
                          href={`#section-${sectionIdx}`}
                          className="font-body text-xs text-gray-600 leading-snug hover:text-black transition-colors line-clamp-2"
                        >
                          {b.text}
                        </a>
                      </li>
                    ))}
                </ol>
              </div>

              {/* 구독 기능 일단 비활성화
              <div className="bg-gray-50 rounded-xl p-5 flex flex-col gap-3 border border-gray-100">
                <p className="font-heading text-base font-medium text-black leading-snug">
                  매주 이런 분석을 받아보세요
                </p>
                <p className="font-body text-xs text-gray-500 leading-relaxed">
                  뉴스레터로 핵심만 요약해서 보내드립니다.
                </p>
                <Link
                  href="/newsletter"
                  className="btn-primary font-body text-xs px-4 py-2.5 rounded-md text-center"
                >
                  무료 구독하기
                </Link>
              </div>
              */}
            </div>
          </aside>
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <>
          <div className="divider" />
          <section className="container-desktop py-12 md:py-16">
            <h2 className="font-heading text-2xl font-medium text-black mb-8">관련 글</h2>
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3 md:gap-6">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="featured" />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
