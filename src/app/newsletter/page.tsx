import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "뉴스레터 | 주식일기",
  description: "매주 월요일, 주요 시장 동향과 핵심 종목 분석을 이메일로 받아보세요.",
};

/* 구독 기능 일단 비활성화 - 아래 원본 코드 참고
import { TrendingUp, Search, BarChart3 } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
const benefits = [...];
const previewItems = [...];
*/

export default function NewsletterPage() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-desktop flex flex-col items-center text-center gap-6">
        <h1 className="font-heading text-3xl md:text-4xl font-medium text-black">
          뉴스레터 준비 중입니다
        </h1>
        <p className="font-body text-[15px] text-gray-600 max-w-md">
          사이트가 성장하면 뉴스레터 구독 기능을 오픈할 예정입니다.
        </p>
        <Link href="/" className="btn-primary font-body text-sm px-6 py-3 rounded-md">
          홈으로
        </Link>
      </div>
    </section>
  );
}
