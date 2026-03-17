import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

const stats = [
  { value: "5년", label: "투자 경력" },
  { value: "180+", label: "발행 글" },
  { value: "2.4만", label: "월간 독자" },
];

const philosophyItems = [
  {
    icon: "📈",
    title: "장기 가치 투자를 믿습니다",
    desc: "단기 시세 차익보다 기업의 본질적 가치에 집중합니다. 10년 후에도 살아남을 기업을 찾는 것이 제 투자 철학의 출발점입니다.",
  },
  {
    icon: "⚖️",
    title: "리스크 관리가 수익보다 먼저입니다",
    desc: "아무리 좋은 종목이라도 포트폴리오 비중 관리 없이는 한 번의 실수가 모든 것을 앗아갈 수 있습니다. 손실을 최소화하는 것이 장기 수익률을 결정합니다.",
  },
  {
    icon: "📚",
    title: "공부하는 투자자가 이깁니다",
    desc: "재무제표, 산업 분석, 매크로 경제까지 — 꾸준히 공부하는 투자자만이 시장에서 살아남습니다. 이 블로그는 그 공부의 기록입니다.",
  },
];

const contacts = [
  {
    icon: <Mail size={24} />,
    title: "이메일",
    desc: "협업 제안, 질문, 피드백 모두 환영합니다.",
    href: "mailto:hello@jusikilgi.com",
    label: "hello@jusikilgi.com",
  },
  // 카카오 오픈채팅 일단 비활성화
  // {
  //   icon: (
  //     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  //     </svg>
  //   ),
  //   title: "카카오 오픈채팅",
  //   desc: "투자 이야기를 편하게 나눠요.",
  //   href: "https://open.kakao.com",
  //   label: "오픈채팅 입장하기",
  // },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero - Dark */}
      <section className="bg-black text-white">
        <div className="container-desktop py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
            {/* Text */}
            <div className="flex-1 flex flex-col gap-6">
              <span className="badge-burgundy self-start text-[11px] tracking-widest uppercase">
                About
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-medium leading-tight">
                안녕하세요,<br />주식 투자자입니다
              </h1>
              <p className="font-body text-[15px] text-gray-400 leading-relaxed max-w-lg">
                2019년부터 국내·미국 주식을 직접 운용하며 배운 것들을 기록합니다. 화려한 수익률 자랑보다 솔직한 실수와 배움을 공유하는 블로그를 지향합니다. 장기 가치 투자를 믿으며, 리스크 관리를 가장 중요하게 생각합니다.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-10 mt-2">
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <span className="font-heading text-3xl font-medium text-white">{s.value}</span>
                    <span className="font-body text-xs text-gray-500">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div className="relative w-full md:w-[360px] h-[280px] md:h-[380px] rounded-2xl overflow-hidden flex-shrink-0 bg-gray-800">
              <Image
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=720&q=80"
                alt="저자 사진"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Philosophy */}
      <section className="container-desktop py-14 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          <div className="lg:w-[340px] flex-shrink-0">
            <span className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500 block mb-4">
              투자 철학
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium text-black leading-snug">
              장기 가치 투자와<br />리스크 관리를 믿습니다
            </h2>
            <p className="font-body text-sm text-gray-600 leading-relaxed mt-4">
              5년간의 투자 여정에서 얻은 세 가지 핵심 원칙입니다.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            {philosophyItems.map((item) => (
              <div key={item.title} className="flex items-start gap-5 py-6 border-t border-gray-100 first:border-t-0 first:pt-0">
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-xl font-medium text-black">{item.title}</h3>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Contact */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="container-desktop flex flex-col items-center text-center gap-4">
          <span className="font-body text-[11px] font-semibold tracking-[1.5px] uppercase text-gray-500">
            Contact
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-black">
            함께 투자 이야기를 나눠요
          </h2>
          <p className="font-body text-[15px] text-gray-600 max-w-md leading-relaxed">
            종목 질문, 협업 제안, 블로그 피드백 모두 환영합니다. 편하게 연락 주세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-xl">
            {contacts.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="flex-1 bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center gap-3 hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                  {c.icon}
                </div>
                <h3 className="font-heading text-lg font-medium text-black">{c.title}</h3>
                <p className="font-body text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                <span className="font-body text-sm font-medium text-black mt-1">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
