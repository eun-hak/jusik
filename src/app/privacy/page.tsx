import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 주식일기',
  description: '주식일기 개인정보처리방침',
};

const sections = [
  {
    title: '1. 수집하는 개인정보',
    content:
      '사이트는 뉴스레터 구독 신청 시 이메일 주소만 수집합니다. 이 외에 별도의 개인정보를 수집하지 않습니다.',
  },
  {
    title: '2. 수집 목적',
    content:
      '수집된 이메일 주소는 주간 뉴스레터 발송 목적으로만 사용됩니다. 제3자에게 판매하거나 광고 목적으로 활용하지 않습니다.',
  },
  {
    title: '3. 보관 기간',
    content:
      '이메일 주소는 구독자가 구독을 취소할 때까지 보관됩니다. 구독 취소 요청 시 즉시 삭제됩니다.',
  },
  {
    title: '4. 제3자 제공',
    content:
      '수집된 개인정보는 법령에 의한 경우를 제외하고 제3자에게 제공하지 않습니다. 단, 뉴스레터 발송 서비스 운영을 위해 이메일 서비스 제공업체와 최소한의 정보를 공유할 수 있습니다.',
  },
  {
    title: '5. 이용자 권리',
    content:
      '이용자는 언제든지 개인정보의 열람, 수정, 삭제를 요청할 수 있습니다. 뉴스레터 이메일 하단의 "구독 취소" 링크를 통해 즉시 해지할 수 있으며, 기타 문의는 이메일로 연락 주시기 바랍니다.',
  },
  {
    title: '6. 쿠키 및 분석 도구',
    content:
      '서비스 개선을 위해 Google Analytics 등 분석 도구를 사용할 수 있으며, 이 과정에서 익명화된 방문 데이터가 수집될 수 있습니다. 브라우저 설정을 통해 쿠키 수집을 거부할 수 있습니다.',
  },
  {
    title: '7. 방침 변경',
    content:
      '본 개인정보처리방침이 변경될 경우 사이트 공지 또는 이메일을 통해 사전 안내드립니다.',
  },
];

export default function PrivacyPage() {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="max-w-[760px] mx-auto px-5">
        <div className="mb-10">
          <span className="font-body text-xs text-gray-500">최종 업데이트: 2026년 1월</span>
          <h1 className="font-heading text-4xl font-medium text-black mt-3 mb-4">
            개인정보처리방침
          </h1>
          <p className="font-body text-[15px] text-gray-600 leading-relaxed">
            주식일기(이하 "사이트")는 이용자의 개인정보를 소중히 여기며, 개인정보 보호 관련 법령을
            준수합니다.
          </p>
        </div>

        <div className="flex flex-col">
          {sections.map((section, i) => (
            <div
              key={i}
              className="py-8 border-t border-gray-100 first:border-t-0 first:pt-0"
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
