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

  // Featured card with large image (mobile style)
  if (variant === "featured") {
    return (
      <Link href={`/article/${slug}`} className="block group">
        <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {imageUrl && (
            <div className="relative w-full h-40 md:h-52">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-burgundy text-white">
                {category}
              </span>
              <span className="text-gray-500 font-body text-[11px]">{date}</span>
            </div>
            <h3 className="font-heading text-lg font-medium text-black leading-tight group-hover:text-burgundy transition-colors">
              {title}
            </h3>
            <p className="font-body text-xs text-gray-600 leading-relaxed line-clamp-2">
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
        <article className="flex items-center gap-3.5 bg-white rounded-xl border border-gray-200 p-4">
          {imageUrl && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
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
            <h3 className="font-body text-sm font-medium text-black leading-tight group-hover:text-burgundy transition-colors line-clamp-2">
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
      <article className="py-7 border-t border-gray-200">
        <div className="flex items-start gap-6">
          {/* Thumbnail (left) */}
          {imageUrl && (
            <div className="relative w-28 h-20 md:w-36 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
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
            <div className="flex items-center gap-3">
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
            <h3 className="font-heading text-xl md:text-2xl font-medium text-black leading-snug group-hover:text-burgundy transition-colors">
              {title}
            </h3>
            <p className="font-body text-[14px] text-gray-600 leading-relaxed line-clamp-2">
              {excerpt}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
