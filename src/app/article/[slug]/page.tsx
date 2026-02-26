import Link from "next/link";
import Image from "next/image";
import ArticleCard, { Article } from "@/components/ArticleCard";

// Mock articles DB
const articles: Record<string, {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
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
    category: "분석",
    date: "2024.01.15",
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

  return (
    <>
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
