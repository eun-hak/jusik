import { TrendingUp, Search, BarChart3 } from "lucide-react";
import { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "뉴스레터 | 주식일기",
  description: "매주 월요일, 주요 시장 동향과 핵심 종목 분석을 이메일로 받아보세요.",
};

const benefits = [
  {
    icon: <TrendingUp size={24} />,
    title: "주간 시장 분석",
    desc: "매주 월요일 아침, 지난 한 주의 핵심 시장 흐름과 이번 주 주목할 변수를 요약해 드립니다.",
  },
  {
    icon: <Search size={24} />,
    title: "종목 심층 탐구",
    desc: "매달 1~2개 종목을 선정해 사업 모델, 경쟁 구도, 밸류에이션을 심층 분석합니다.",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "포트폴리오 전략",
    desc: "비중 조정, 리밸런싱 시점, 분할 매수 전략 등 실전에서 바로 써먹을 인사이트를 공유합니다.",
  },
];

const previewItems = [
  "이번 주 주목 종목: 반도체 업황 회복 & 4월 FOMC 결과 분석",
  "지난 주 시황 요약: 코스피 2,480 지지 확인",
  "이번 주 경제 일정: FOMC 의사록 공개, 국내 CPI 발표",
  "다음 주 투자전략: 방어주 비중 확대 검토",
];

export default function NewsletterPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-14 md:py-20">
        <div className="container-desktop">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: Form */}
            <div className="flex-1 flex flex-col gap-6">
              <span className="badge-burgundy self-start text-[11px] tracking-widest uppercase">
                Newsletter
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-medium text-black leading-tight">
                매주 월요일,<br />한 주의 시장을<br />먼저 읽으세요
              </h1>
              <p className="font-body text-[15px] text-gray-600 leading-relaxed max-w-md">
                2,600명의 투자자가 구독 중인 주식일기 뉴스레터입니다. 매주 월요일 아침, 한 주
                시장의 핵심 변수와 주목할 종목을 정리해 드립니다.
              </p>

              <NewsletterForm variant="default" />
            </div>

            {/* Right: Preview Card */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-black rounded-2xl p-6 flex flex-col gap-5 shadow-xl">
                {/* Card Header */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                    <span className="text-black font-heading text-sm font-semibold">주</span>
                  </div>
                  <div>
                    <p className="font-body text-xs text-gray-400">주식일기 뉴스레터</p>
                    <p className="font-body text-[11px] text-gray-600">매주 월요일 오전 7시 발송</p>
                  </div>
                </div>

                {/* Preview Title */}
                <div className="border-t border-gray-800 pt-4">
                  <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2">
                    이번 주 미리보기
                  </p>
                  <h3 className="font-heading text-lg font-medium text-white leading-snug">
                    {previewItems[0]}
                  </h3>
                </div>

                {/* Preview Items */}
                <div className="flex flex-col gap-3">
                  {previewItems.slice(1).map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-burgundy flex-shrink-0 mt-1.5" />
                      <p className="font-body text-xs text-gray-400 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Benefits - Dark */}
      <section className="bg-black py-14 md:py-20">
        <div className="container-desktop flex flex-col items-center gap-10">
          <div className="text-center flex flex-col gap-3">
            <span className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500">
              구독 혜택
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-white">
              구독하면 받게 되는 것들
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-white/5 border border-white/10 rounded-xl p-7 flex flex-col gap-4 hover:bg-white/8 transition-colors"
              >
                <div className="w-12 h-12 bg-burgundy rounded-xl flex items-center justify-center text-white">
                  {b.icon}
                </div>
                <h3 className="font-heading text-xl font-medium text-white">{b.title}</h3>
                <p className="font-body text-sm text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <NewsletterForm variant="default" />
            <p className="font-body text-xs text-gray-600">이미 2,600명이 읽고 있어요</p>
          </div>
        </div>
      </section>
    </>
  );
}
