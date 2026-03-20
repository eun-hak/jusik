import Link from "next/link";
import Image from "next/image";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime?: string;
  imageUrl?: string;
}

type CardVariant = "list" | "featured" | "compact";

interface ArticleCardProps {
  article: Article;
  variant?: CardVariant;
}

export default function ArticleCard({
  article,
  variant = "list",
}: ArticleCardProps) {
  const { slug, title, excerpt, date, category, readTime, imageUrl } = article;

  // Featured card — 관련 글 그리드용: 컴팩트 + 행 높이 맞춤 (h-full, 제목·요약 2줄 고정 영역)
  if (variant === "featured") {
    return (
      <Link href={`/article/${slug}`} className="block h-full min-h-0 group">
        <article className="flex h-full min-h-0 flex-col rounded-xl border border-gray-200 bg-white overflow-hidden">
          {imageUrl ? (
            <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-t-xl md:h-40">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="h-32 shrink-0 rounded-t-xl bg-gray-100 md:h-40"
              aria-hidden
            />
          )}
          {/* min-h-min: flex-1 영역이 본문 높이보다 작게 줄어들며 글자가 반쯤 잘리는 것 방지 */}
          <div className="flex min-h-min flex-1 flex-col gap-2 p-3 max-[360px]:p-2.5">
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-burgundy px-2 py-0.5 text-[8px] font-semibold text-white md:text-[9px]">
                {category}
              </span>
              <span className="font-body text-[10px] text-gray-500 md:text-[11px]">
                {date}
              </span>
            </div>
            <h3 className="font-heading text-base font-medium leading-snug text-black line-clamp-2 break-keep group-hover:text-burgundy transition-colors md:text-[17px] md:leading-tight">
              {title}
            </h3>
            <p className="mt-auto font-body text-[11px] leading-normal text-gray-600 line-clamp-2 break-keep [overflow-wrap:anywhere] md:text-xs md:leading-relaxed">
              {excerpt}
            </p>
          </div>
        </article>
      </Link>
    );
  }

  // Compact card with small image (mobile horizontal style)
  if (variant === "compact") {
    return (
      <Link href={`/article/${slug}`} className="block group">
        <article className="flex items-center gap-3 max-[360px]:gap-2.5 bg-white rounded-xl border border-gray-200 p-4 max-[360px]:p-3">
          {imageUrl && (
            <div className="relative w-20 h-20 max-[360px]:w-[4.5rem] max-[360px]:h-[4.5rem] rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full text-[9px] font-semibold bg-burgundy text-white">
              {category}
            </span>
            <h3 className="font-body text-sm max-[360px]:text-[13px] font-medium text-black leading-snug group-hover:text-burgundy transition-colors line-clamp-2 break-keep [overflow-wrap:anywhere]">
              {title}
            </h3>
            <span className="text-gray-500 font-body text-[11px]">
              {date} {readTime && `· ${readTime}`}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  // Default list card (desktop style - with compact thumbnail)
  return (
    <Link href={`/article/${slug}`} className="block group">
      <article className="py-7 max-[360px]:py-5 border-t border-gray-200">
        <div className="flex items-start gap-3 md:gap-6">
          {/* Thumbnail (left) */}
          {imageUrl && (
            <div className="relative w-24 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Text */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
              <span className="text-gray-500 font-body text-xs">{date}</span>
              <span className="text-gray-300 font-body text-xs">•</span>
              <span className="text-burgundy font-body text-xs font-medium tracking-wide">
                {category}
              </span>
              {readTime && (
                <>
                  <span className="text-gray-300 font-body text-xs">•</span>
                  <span className="text-gray-500 font-body text-xs">{readTime}</span>
                </>
              )}
            </div>
            <h3 className="font-heading text-lg max-[360px]:text-base md:text-2xl font-medium text-black leading-snug break-keep [overflow-wrap:anywhere] group-hover:text-burgundy transition-colors">
              {title}
            </h3>
            <p className="font-body text-[13px] max-[360px]:text-xs md:text-[14px] text-gray-600 leading-relaxed line-clamp-2 break-keep [overflow-wrap:anywhere]">
              {excerpt}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
