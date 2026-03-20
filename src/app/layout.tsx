import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SITE_URL } from "@/lib/config";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "주식일기 | 주식 투자의 모든 것",
  description: "시장 분석부터 종목 탐구, 투자 전략까지. 더 나은 투자 결정을 위한 인사이트를 전합니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: SITE_URL,
    title: "주식일기 | 주식 투자의 모든 것",
    description: "시장 분석부터 종목 탐구, 투자 전략까지. 더 나은 투자 결정을 위한 인사이트를 전합니다.",
    siteName: "주식일기",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "주식일기 | 주식 투자의 모든 것",
    description: "시장 분석부터 종목 탐구, 투자 전략까지. 더 나은 투자 결정을 위한 인사이트를 전합니다.",
  },
  verification: {
    google: "nGLC6wqeingyxdWpDtTR9DKlBw7TNDT9A8_l8PrHWt0",
  },
  other: {
    "naver-site-verification": "a59476ff561c68cdd35aac5c09594b12a99db892",
  },
};

const GA_MEASUREMENT_ID = "G-B7ZFS1S7YS";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ID ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </head>
      <body
        className={`${cormorantGaramond.variable} ${outfit.variable} antialiased`}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <a href="#main-content" className="skip-link">본문으로 바로가기</a>
        {children}
      </body>
    </html>
  );
}
