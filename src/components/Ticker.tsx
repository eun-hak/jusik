"use client";

const tickerItems = [
  "KOSPI 2,485.67 ▲12.34",
  "KOSDAQ 731.22 ▼3.15",
  "삼성전자 +1.2%",
  "SK하이닉스 -0.8%",
  "현대차 +2.1%",
  "카카오 -1.4%",
  "LG에너지솔루션 +0.6%",
  "NAVER +0.3%",
  "셀트리온 -0.5%",
  "기아 +1.8%",
];

export default function Ticker() {
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div
      role="marquee"
      aria-label="실시간 주가 정보"
      className="bg-black text-white h-[41px] flex items-center overflow-hidden"
    >
      {/* LIVE 배지 */}
      <div className="flex items-center gap-1.5 pl-5 md:pl-[120px] pr-4 flex-shrink-0 border-r border-gray-800">
        <span className="w-1.5 h-1.5 rounded-full bg-live-red animate-pulse" aria-hidden="true" />
        <span className="font-body text-[11px] font-semibold tracking-widest text-white uppercase">
          LIVE
        </span>
      </div>

      {/* Scrolling items */}
      <div className="flex-1 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center" aria-hidden={i >= tickerItems.length}>
              <span className="font-body text-[12px] text-gray-300 px-5">{item}</span>
              <span className="text-gray-700 text-[10px]">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
