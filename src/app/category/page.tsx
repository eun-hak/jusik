import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '카테고리 | 주식일기',
  description: '주식일기의 모든 카테고리를 한눈에 확인하세요.',
};

const categories = [
  {
    slug: 'analysis',
    name: '시장 분석',
    description:
      '국내외 주식 시장의 흐름과 섹터별 심층 분석을 통해 투자 인사이트를 전달합니다.',
    count: 24,
    icon: '📊',
  },
  {
    slug: 'stocks',
    name: '종목',
    description: '개별 종목의 사업 모델, 실적, 밸류에이션을 깊이 파헤칩니다.',
    count: 18,
    icon: '📈',
  },
  {
    slug: 'notes',
    name: '투자노트',
    description: '실전 투자에서 배운 교훈과 전략을 솔직하게 공유합니다.',
    count: 31,
    icon: '📝',
  },
  {
    slug: 'market',
    name: '시장동향',
    description: '매크로 경제와 글로벌 시장의 흐름을 빠르게 짚어드립니다.',
    count: 12,
    icon: '🌐',
  },
];

export default function CategoryIndexPage() {
  return (
    <>
      <section className="bg-white pt-10 pb-4">
        <div className="container-desktop flex flex-col items-center text-center gap-4 py-8">
          <span className="badge-burgundy text-[11px] tracking-widest uppercase">카테고리</span>
          <h1 className="font-heading text-4xl md:text-5xl font-medium text-black">
            모든 카테고리
          </h1>
          <p className="font-body text-[15px] text-gray-600 max-w-lg leading-relaxed">
            관심 있는 주제를 선택해 깊이 있는 콘텐츠를 탐색해보세요.
          </p>
        </div>
      </section>

      <div className="divider" />

      <section className="container-desktop py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group border border-gray-200 rounded-xl p-8 hover:border-gray-400 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="font-body text-xs text-gray-400">{cat.count}개의 글</span>
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-medium text-black group-hover:text-burgundy transition-colors mb-2">
                    {cat.name}
                  </h2>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <span className="font-body text-sm text-gray-400 group-hover:text-black transition-colors">
                  탐색하기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
