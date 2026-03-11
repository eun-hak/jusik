import { Metadata } from "next";
import Link from "next/link";
import CategoryContent from "@/components/CategoryContent";

const categories: Record<string, {
  name: string;
  description: string;
  tags: string[];
}> = {
  analysis: {
    name: "시장 분석",
    description: "국내외 주식 시장의 흐름과 섹터별 심층 분석을 통해 투자 인사이트를 전달합니다.",
    tags: ["전체", "반도체/AI", "배터리 시장", "포트폴리오 전략", "ETF"],
  },
  stocks: {
    name: "종목",
    description: "개별 종목의 사업 모델, 실적, 밸류에이션을 깊이 파헤칩니다.",
    tags: ["전체", "대형주", "중소형주", "해외주식", "배당주"],
  },
  notes: {
    name: "투자노트",
    description: "실전 투자에서 배운 교훈과 전략을 솔직하게 공유합니다.",
    tags: ["전체", "매수기록", "매도기록", "포트폴리오", "실수"],
  },
  market: {
    name: "시장동향",
    description: "매크로 경제와 글로벌 시장의 흐름을 빠르게 짚어드립니다.",
    tags: ["전체", "금리", "환율", "미국시장", "이머징"],
  },
};

const articles = [
  {
    slug: "2024-semiconductor-buy-now",
    title: "2024년 반도체 섹터, 지금 매수해도 될까?",
    excerpt:
      "AI 수요 폭증으로 반도체 업종이 다시 주목받고 있습니다. 삼성전자, SK하이닉스 밸류에이션과 실적 전망을 짚어봅니다.",
    date: "2024.01.15",
    category: "분석",
    readTime: "8분",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    subTags: ["반도체/AI"],
  },
  {
    slug: "sk-hynix-hbm-strategy",
    title: "SK하이닉스 HBM 전략과 포트폴리오 전략",
    excerpt:
      "차세대 메모리 HBM 시장을 선점한 SK하이닉스의 중장기 전략과 투자 포인트를 분석합니다.",
    date: "2024.01.09",
    category: "분석",
    readTime: "11분",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    subTags: ["반도체/AI"],
  },
  {
    slug: "2nd-battery-diversification-strategy",
    title: "2차전지 섹터 하락 이후 분산투자 전략까지",
    excerpt:
      "전기차 수요 둔화로 급락한 2차전지 섹터, 저점 매수 기회인지 가치 함정인지 냉철하게 분석합니다.",
    date: "2024.01.05",
    category: "분석",
    readTime: "9분",
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
    subTags: ["배터리 시장"],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug];

  if (!category) return { title: "카테고리 | 주식일기" };

  return {
    title: `${category.name} | 주식일기`,
    description: category.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(categories).map((slug) => ({ slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories[slug] ?? categories["analysis"];

  return (
    <>
      {/* Category Header */}
      <section className="bg-white pt-10 pb-4">
        <div className="container-desktop">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-body text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-black transition-colors">홈</Link>
            <span>/</span>
            <Link href="/category" className="hover:text-black transition-colors">카테고리</Link>
            <span>/</span>
            <span className="text-black">{category.name}</span>
          </div>

          <div className="flex flex-col items-center text-center gap-4 py-4">
            <span className="badge-burgundy text-[11px] tracking-widest uppercase">카테고리</span>
            <h1 className="font-heading text-4xl md:text-5xl font-medium text-black">
              {category.name}
            </h1>
            <p className="font-body text-[15px] text-gray-600 max-w-lg leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Article List with Filter */}
      <section className="container-desktop py-10 md:py-14">
        <CategoryContent tags={category.tags} articles={articles} />
      </section>
    </>
  );
}
