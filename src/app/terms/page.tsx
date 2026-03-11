import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 주식일기',
  description: '주식일기 이용약관',
};

const sections = [
  {
    title: '1. 서비스 소개',
    content:
      '주식일기는 국내외 주식 시장에 대한 분석, 종목 탐구, 투자 전략 등의 콘텐츠를 제공하는 개인 블로그입니다.',
  },
  {
    title: '2. 투자 주의사항 (면책 조항)',
    content:
      '본 사이트의 모든 콘텐츠는 정보 제공 목적으로만 작성되었으며, 투자 권유 또는 종목 추천이 아닙니다. 모든 투자 결정 및 그에 따른 손익은 전적으로 투자자 본인의 책임입니다. 사이트 운영자는 콘텐츠를 기반으로 한 투자 결과에 대해 어떠한 법적 책임도 지지 않습니다.',
  },
  {
    title: '3. 콘텐츠 저작권',
    content:
      '본 사이트의 모든 글, 이미지, 그래픽 등의 콘텐츠는 저작권법의 보호를 받습니다. 출처를 명시하지 않은 무단 복사, 배포, 상업적 이용은 금지됩니다.',
  },
  {
    title: '4. 링크 및 외부 사이트',
    content:
      '본 사이트는 외부 사이트로의 링크를 포함할 수 있으나, 링크된 외부 사이트의 내용 및 운영에 대해서는 책임을 지지 않습니다.',
  },
  {
    title: '5. 서비스 변경 및 중단',
    content:
      '사이트 운영자는 사전 통지 없이 서비스 내용을 변경하거나 중단할 수 있습니다. 이로 인한 이용자의 손해에 대해서는 책임을 지지 않습니다.',
  },
  {
    title: '6. 약관 변경',
    content:
      '본 이용약관은 사전 공지 없이 변경될 수 있으며, 변경된 약관은 사이트 게시 즉시 효력을 가집니다. 이용자는 정기적으로 약관을 확인할 책임이 있습니다.',
  },
  {
    title: '7. 준거법',
    content:
      '본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 대한민국 법원을 관할 법원으로 합니다.',
  },
];

export default function TermsPage() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-[760px] mx-auto px-5">
        <div className="mb-10">
          <span className="font-body text-xs text-gray-500">최종 업데이트: 2026년 1월</span>
          <h1 className="font-heading text-4xl font-medium text-black mt-3 mb-4">이용약관</h1>
          <p className="font-body text-[15px] text-gray-600 leading-relaxed">
            주식일기 서비스를 이용하시기 전에 아래 약관을 주의 깊게 읽어 주시기 바랍니다.
          </p>
        </div>

        <div className="flex flex-col">
          {sections.map((section, i) => (
            <div
              key={i}
              className={`py-8 border-t border-gray-100 ${i === 0 ? 'border-t-0 pt-0' : ''}`}
            >
              <h2 className="font-heading text-xl font-medium text-black mb-3">
                {section.title}
              </h2>
              <p className="font-body text-[15px] text-gray-700 leading-[1.9]">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
