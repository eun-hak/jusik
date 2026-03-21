/**
 * 배포 기본 도메인. NEXT_PUBLIC_SITE_URL 을 설정하지 않아도 이 값이 그대로 사용됩니다.
 * (스테이징·다른 도메인만 쓸 때에만 환경 변수로 덮어쓰면 됩니다.)
 */
const DEFAULT_SITE_URL = "https://stock.plentyer.com";

/** 템플릿 기본값이 그대로 남은 경우 — 사이트맵·OG가 yourdomain.com 으로 나가는 것 방지 */
function isPlaceholderSiteUrl(url: string): boolean {
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    return host === "yourdomain.com" || host === "www.yourdomain.com";
  } catch {
    return true;
  }
}

const envOverride = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const raw =
  envOverride && envOverride.length > 0 && !isPlaceholderSiteUrl(envOverride)
    ? envOverride
    : DEFAULT_SITE_URL;

export const SITE_URL = raw.replace(/\/+$/, "");

export const SITE_NAME = "주식일기";
export const SITE_DESCRIPTION =
  "시장 분석부터 종목 탐구, 투자 전략까지. 더 나은 투자 결정을 위한 인사이트를 전합니다.";
