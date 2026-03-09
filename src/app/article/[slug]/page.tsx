import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import ArticleCard, { Article } from "@/components/ArticleCard";

// Mock articles DB
const articles: Record<string, {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  date: string;
  publishedTime: string; // ISO String for SEO
  readTime: string;
  author: string;
  imageUrl: string;
  content: { type: "h2" | "h3" | "p" | "quote"; text: string }[];
  tags: string[];
}> = {
  "2024-semiconductor-buy-now": {
    slug: "2024-semiconductor-buy-now",
    title: "2024년 반도체 섹터, 지금 매수해도 될까?",
    subtitle:
      "AI 수요 폭증으로 반도체 업종이 다시 주목받고 있습니다. 삼성전자, SK하이닉스를 중심으로 밸류에이션과 실적 전망을 짚어봅니다.",
    description: "2024년 반도체 섹터 전망 분석. AI 열풍에 따른 HBM 수요 증가 여파와 삼성전자, SK하이닉스 밸류에이션 분석 및 투자 전략.",
    category: "분석",
    date: "2024.01.15",
    publishedTime: "2024-01-15T09:00:00+09:00",
    readTime: "8분",
    author: "주식일기",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    tags: ["반도체", "삼성전자", "SK하이닉스", "AI", "분석"],
    content: [
      {
        type: "p",
        text: "2023년 하반기부터 반도체 섹터가 강하게 반등하고 있습니다. AI 열풍이 HBM 수요를 폭발적으로 끌어올리며, 그 수혜를 가장 직접적으로 받는 SK하이닉스가 52주 신고가를 경신했습니다.",
      },
      {
        type: "h2",
        text: "왜 지금 반도체인가",
      },
      {
        type: "p",
        text: "ChatGPT 이후 생성형 AI 서비스가 본격적으로 상용화되면서, 대규모 언어 모델(LLM)을 구동하는 데이터센터의 GPU·HBM 수요가 폭발적으로 늘고 있습니다. 엔비디아 H100 GPU 한 장당 HBM이 80GB 이상 탑재되며, 이는 반도체 메모리 업계에 전례 없는 수요를 만들어내고 있습니다.",
      },
      {
        type: "quote",
        text: "HBM은 일반 DRAM 대비 ASP(평균 판매가)가 5배 이상 높습니다. SK하이닉스는 HBM3E 독점 공급으로 영업이익률이 빠르게 회복될 전망입니다.",
      },
      {
        type: "h2",
        text: "밸류에이션: 지금도 싼가",
      },
      {
        type: "p",
        text: "삼성전자는 현재 PBR 1.4배 수준으로 역사적 저점 구간에 있습니다. 반도체 업황 회복과 함께 HBM 사업 경쟁력 확보가 확인된다면, 리레이팅 여지가 충분합니다. SK하이닉스는 이미 선행 지표가 반영되며 PBR 2배를 넘어섰지만, 실적 모멘텀은 여전히 유효합니다.",
      },
      {
        type: "h3",
        text: "리스크 요인",
      },
      {
        type: "p",
        text: "단기적으로는 미국의 대중 반도체 수출 규제 강화, 고객사의 AI 투자 사이클 둔화 가능성, 그리고 삼성전자의 HBM3E 품질 인증 지연이 리스크입니다. 장기 투자자라면 이런 노이즈에 흔들리지 않는 것이 중요합니다.",
      },
      {
        type: "h2",
        text: "결론: 분할 매수 전략 추천",
      },
      {
        type: "p",
        text: "2024년 상반기는 반도체 업사이클 초입 단계입니다. 단기 급등 부담이 있는 SK하이닉스보다는, 상대적으로 저평가된 삼성전자를 분할 매수하는 전략을 권장합니다. 목표 비중은 포트폴리오의 10~15% 이내로 관리하세요.",
      },
    ],
  },
  "how-to-get-adsense-approval-seo-guide": {
    slug: "how-to-get-adsense-approval-seo-guide",
    title: "구글 애드센스 승인받는 글쓰기 핵심 전략 (SEO 최적화 완벽 가이드)",
    subtitle: "애드센스 고시를 한 번에 통과하는 비결. 구글 SEO 친화적인 글 구조, 키워드 배치, 가독성 높은 콘텐츠 작성법을 모두 공개합니다.",
    description: "구글 애드센스 한 번에 승인받는 글쓰기 비결! 구글 봇이 좋아하는 SEO 친화적인 문서 구조 설계, H 태그 활용법, 핵심 키워드 배치 전략까지 완벽하게 정리했습니다.",
    category: "분석",
    date: "2024.03.10",
    publishedTime: "2024-03-10T10:00:00+09:00",
    readTime: "7분",
    author: "주식일기",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tags: ["애드센스", "승인", "SEO", "검색엔진최적화", "블로그"],
    content: [
      {
        type: "p",
        text: "블로그 수익화의 첫걸음, 바로 '애드센스 승인'입니다. 요즘은 애드센스 자체의 기준이 높아져서 흔히 '애드센스 고시'라고도 부르는데요. 승인을 위해 가장 중요한 것은 '구글이 좋아하는 구조'로 글을 작성하는 것입니다. 이 글에서는 SEO(검색 엔진 최적화) 관점에서 완벽한 글쓰기 구조를 살펴보도록 하겠습니다.",
      },
      {
        type: "h2",
        text: "1. 구글 봇(Bot)이 이해하기 쉬운 뼈대: H 태그 활용",
      },
      {
        type: "p",
        text: "구글의 크롤러는 사람처럼 글의 맥락을 이미지만으로 파악하지 못합니다. 대신 HTML 문서의 구조, 특히 헤딩(H 태그)를 통해 이 문서가 어떤 내용을 다루고 있고 무엇이 중요한지 파악합니다.",
      },
      {
        type: "quote",
        text: "글의 기둥이 되는 H2(대제목), 세부 내용을 다루는 H3(중제목)를 적절한 위계로 사용하는 것이 핵심입니다. 절대 폰트 크기를 키우기 위해 H 태그를 오남용해서는 안 됩니다.",
      },
      {
        type: "h2",
        text: "2. 본문 분량과 퀄리티 유지",
      },
      {
        type: "p",
        text: "콘텐츠의 품질(Quality)은 애드센스 승인을 결정짓는 가장 강력한 요소입니다. 의미 없는 단어의 나열이나 다른 블로그의 글을 단순 복사(Ctrl+C, V)하는 것은 오히려 승인 대기 시간만 길어지게 할 뿐입니다.",
      },
      {
        type: "h3",
        text: "최소 1,500자 이상의 글자 수",
      },
      {
        type: "p",
        text: "구글은 하나의 문서를 완전한 정보를 담고 있는 백과사전처럼 취급합니다. 방문자가 내 블로그 글 하나만 읽고도 해당 주제에 대한 답을 얻을 수 있어야 합니다. 그 정도의 정보를 담으려면 공백을 제외하고 최소 1,000자에서 1,500자 이상의 본문이 필요합니다.",
      },
      {
        type: "h2",
        text: "3. 정확한 정보와 체류 시간",
      },
      {
        type: "p",
        text: "결국 구글 애드센스는 '광고 플랫폼'입니다. 광고주를 위해 체류 시간이 길고 방문자의 집중도가 높은 웹사이트에 광고를 내보내려고 합니다. 글의 문단을 짧게 끊어 읽기 쉽게 만들고, 사용자 경험을 해치지 않게 설계하는 것이 중요합니다.",
      },
    ],
  },
};

const relatedArticles: Article[] = [
  {
    slug: "samsung-vs-tsmc-dividend",
    title: "삼성전자 vs TSMC, 반도체 패권 전쟁의 승자는?",
    excerpt: "파운드리 시장의 양강 구도가 굳어지는 가운데, 두 기업의 기술력과 수익성을 비교합니다.",
    date: "2024.01.12",
    category: "종목",
    readTime: "12분",
  },
  {
    slug: "hbm-deep-dive",
    title: "HBM이란 무엇인가? 차세대 메모리 완전 해부",
    excerpt: "AI 시대의 핵심 부품 HBM의 구조, 제조 공정, 시장 전망을 총정리합니다.",
    date: "2024.01.08",
    category: "분석",
    readTime: "15분",
  },
  {
    slug: "individual-investor-etf-portfolio",
    title: "초보 투자자를 위한 ETF 포트폴리오 구성법",
    excerpt: "변동성이 큰 시장에서 ETF로 분산 투자하는 방법을 단계별로 설명합니다.",
    date: "2024.01.10",
    category: "투자노트",
    readTime: "10분",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    return {
      title: "글을 찾을 수 없습니다 | 주식일기",
    };
  }

  const DOMAIN = "https://yourdomain.com"; // TODO: 실제 도메인으로 교체

  return {
    title: `${article.title} | 주식일기`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedTime,
      authors: [article.author],
      url: `${DOMAIN}/article/${article.slug}`,
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug] ?? articles["2024-semiconductor-buy-now"];

  const DOMAIN = "https://yourdomain.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.imageUrl,
    datePublished: article.publishedTime,
    dateModified: article.publishedTime,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "주식일기",
      logo: {
        "@type": "ImageObject",
        url: `${DOMAIN}/logo.png`, // 로고 경로
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${DOMAIN}/article/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Article Header */}
      <section className="bg-white pt-12 pb-8">
        <div className="max-w-[760px] mx-auto px-5 flex flex-col items-center text-center gap-5">
          <span className="badge-burgundy text-[11px] tracking-widest uppercase">
            {article.category}
          </span>
          <h1 className="font-heading text-3xl md:text-5xl font-medium text-black leading-tight">
            {article.title}
          </h1>
          <p className="font-body text-[15px] text-gray-600 leading-relaxed">
            {article.subtitle}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-heading text-sm font-semibold">주</span>
            </div>
            <div className="flex items-center gap-3 font-body text-sm text-gray-500">
              <span className="font-medium text-black">{article.author}</span>
              <span className="text-gray-300">·</span>
              <span>{article.date}</span>
              <span className="text-gray-300">·</span>
              <span>읽는 시간 {article.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="w-full aspect-[16/7] relative overflow-hidden bg-gray-100">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="divider" />

      {/* Article Body + Sidebar */}
      <section className="container-desktop py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Article Body */}
          <article className="flex-1 min-w-0 max-w-[680px]">
            {article.content.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="font-heading text-2xl md:text-3xl font-medium text-black mt-10 mb-4 first:mt-0">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3 key={i} className="font-heading text-xl font-medium text-black mt-8 mb-3">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote key={i} className="border-l-4 border-burgundy pl-5 my-7">
                    <p className="font-body text-[15px] text-gray-700 leading-relaxed italic">
                      {block.text}
                    </p>
                  </blockquote>
                );
              }
              return (
                <p key={i} className="font-body text-[15px] text-gray-700 leading-[1.9] mb-5">
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
                <h3 className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500 mb-4">
                  목차
                </h3>
                <ol className="flex flex-col gap-2.5">
                  {article.content
                    .filter((b) => b.type === "h2" || b.type === "h3")
                    .map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="font-body text-xs text-gray-400 mt-0.5 flex-shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-body text-sm leading-snug ${
                            b.type === "h3" ? "text-gray-500 pl-2" : "text-gray-700"
                          }`}
                        >
                          {b.text}
                        </span>
                      </li>
                    ))}
                </ol>
              </div>

              {/* Newsletter CTA */}
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
            </div>
          </aside>
        </div>
      </section>

      <div className="divider" />

      {/* Related Articles */}
      <section className="container-desktop py-12 md:py-16">
        <h2 className="font-heading text-2xl font-medium text-black mb-8">관련 글</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="featured" />
          ))}
        </div>
      </section>
    </>
  );
}
