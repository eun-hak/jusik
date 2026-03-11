"use client";

import { useEffect, useState, useCallback } from "react";
import type { StockItem } from "@/app/api/stocks/route";

const REFRESH_INTERVAL_MS = 60_000;

function formatItem(item: StockItem): string {
  const sign = item.changePercent >= 0 ? "+" : "";
  const arrow = item.changePercent >= 0 ? "▲" : "▼";

  if (item.type === "index") {
    const absChange = Math.abs(item.change).toFixed(2);
    return `${item.name} ${item.price.toLocaleString("ko-KR", { maximumFractionDigits: 2 })} ${arrow}${absChange}`;
  }

  return `${item.name} ${sign}${item.changePercent.toFixed(1)}%`;
}

const FALLBACK_ITEMS = [
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
  const [tickerItems, setTickerItems] = useState<string[]>(FALLBACK_ITEMS);
  const [isLive, setIsLive] = useState(false);

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch("/api/stocks", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      if (Array.isArray(data.items) && data.items.length > 0) {
        setTickerItems(data.items.map(formatItem));
        setIsLive(true);
      }
    } catch {
      // 실패 시 fallback 유지
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const timer = setInterval(fetchStocks, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchStocks]);

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div
      role="marquee"
      aria-label="실시간 주가 정보"
      className="bg-black text-white h-[41px] flex items-center overflow-hidden"
    >
      {/* LIVE 배지 */}
      <div className="flex items-center gap-1.5 pl-5 md:pl-[120px] pr-4 flex-shrink-0 border-r border-gray-800">
        <span
          className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-live-red animate-pulse" : "bg-gray-500"}`}
          aria-hidden="true"
        />
        <span className="font-body text-[11px] font-semibold tracking-widest text-white uppercase">
          LIVE
        </span>
      </div>

      {/* Scrolling items */}
      <div className="flex-1 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {doubled.map((item, i) => {
            const isNegative = item.includes("▼") || item.match(/[-]\d/);
            const isPositive = item.includes("▲") || item.match(/[+]\d/);

            return (
              <span
                key={i}
                className="flex items-center"
                aria-hidden={i >= tickerItems.length}
              >
                <span
                  className={`font-body text-[12px] px-5 ${
                    isNegative
                      ? "text-red-400"
                      : isPositive
                        ? "text-green-400"
                        : "text-gray-300"
                  }`}
                >
                  {item}
                </span>
                <span className="text-gray-700 text-[10px]">|</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
