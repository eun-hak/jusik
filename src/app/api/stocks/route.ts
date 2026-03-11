import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const STOCKS = [
  { symbol: "^KS11", name: "KOSPI", type: "index" as const },
  { symbol: "^KQ11", name: "KOSDAQ", type: "index" as const },
  { symbol: "005930.KS", name: "삼성전자", type: "stock" as const },
  { symbol: "000660.KS", name: "SK하이닉스", type: "stock" as const },
  { symbol: "005380.KS", name: "현대차", type: "stock" as const },
  { symbol: "035720.KS", name: "카카오", type: "stock" as const },
  { symbol: "373220.KS", name: "LG에너지솔루션", type: "stock" as const },
  { symbol: "035420.KS", name: "NAVER", type: "stock" as const },
  { symbol: "068270.KS", name: "셀트리온", type: "stock" as const },
  { symbol: "000270.KS", name: "기아", type: "stock" as const },
];

export interface StockItem {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: "index" | "stock";
}

export async function GET() {
  try {
    const yahooFinance = new YahooFinance();
    const symbols = STOCKS.map((s) => s.symbol);

    const quotes = await yahooFinance.quote(symbols, {
      fields: [
        "regularMarketPrice",
        "regularMarketChange",
        "regularMarketChangePercent",
      ],
      return: "object",
    });

    const items: StockItem[] = STOCKS.map((stock) => {
      const quote = quotes[stock.symbol];
      if (!quote) return null;
      return {
        name: stock.name,
        price: quote.regularMarketPrice ?? 0,
        change: quote.regularMarketChange ?? 0,
        changePercent: quote.regularMarketChangePercent ?? 0,
        type: stock.type,
      };
    }).filter(Boolean) as StockItem[];

    return NextResponse.json(
      { items, updatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("[stocks/route] fetch error:", error);
    return NextResponse.json(
      { error: "주가 데이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}
