import { ImageResponse } from "next/og";
import { SITE_URL } from "@/lib/config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function siteHostname(): string {
  try {
    return new URL(SITE_URL).hostname;
  } catch {
    return "stock.plentyer.com";
  }
}

export default async function OGImage() {
  const hostname = siteHostname();
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 그라디언트 - 오른쪽 상단 Burgundy glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(107,45,60,0.35) 0%, rgba(107,45,60,0.08) 50%, transparent 70%)",
          }}
        />

        {/* 배경 그리드 패턴 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* 왼쪽 Burgundy 수직 강조선 */}
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            width: "5px",
            height: "100%",
            background: "linear-gradient(to bottom, transparent, #6B2D3C 30%, #6B2D3C 70%, transparent)",
          }}
        />

        {/* 로고 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "52px",
          }}
        >
          <div
            style={{
              background: "white",
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#0A0A0A",
                fontSize: "30px",
                fontWeight: "700",
                fontFamily: "serif",
              }}
            >
              주
            </span>
          </div>
          <span
            style={{
              color: "white",
              fontSize: "28px",
              fontWeight: "500",
              fontFamily: "sans-serif",
              letterSpacing: "-0.3px",
            }}
          >
            주식일기
          </span>
        </div>

        {/* 메인 헤딩 */}
        <h1
          style={{
            color: "white",
            fontSize: "80px",
            fontWeight: "600",
            fontFamily: "serif",
            lineHeight: 1.05,
            margin: "0 0 28px 0",
            maxWidth: "820px",
            letterSpacing: "-1px",
          }}
        >
          주식 투자의
          <br />
          모든 것
        </h1>

        {/* Burgundy 구분선 */}
        <div
          style={{
            width: "64px",
            height: "4px",
            background: "#6B2D3C",
            borderRadius: "2px",
            marginBottom: "28px",
          }}
        />

        {/* 서브태그라인 */}
        <p
          style={{
            color: "#888888",
            fontSize: "24px",
            fontFamily: "sans-serif",
            margin: 0,
            fontWeight: "400",
            letterSpacing: "0.2px",
          }}
        >
          시장 분석 · 종목 탐구 · 투자 전략
        </p>

        {/* 우하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "100px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#6B2D3C",
            }}
          />
          <span
            style={{
              color: "#444444",
              fontSize: "16px",
              fontFamily: "sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            {hostname}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
