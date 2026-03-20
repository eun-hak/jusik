/**
 * 배포 기본 도메인. NEXT_PUBLIC_SITE_URL 을 설정하지 않아도 이 값이 그대로 사용됩니다.
 * (스테이징·다른 도메인만 쓸 때에만 환경 변수로 덮어쓰면 됩니다.)
 */
const DEFAULT_SITE_URL = "https://stock.plentyer.com";

const envOverride = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const raw =
  envOverride && envOverride.length > 0 ? envOverride : DEFAULT_SITE_URL;

export const SITE_URL = raw.replace(/\/+$/, "");

export const SITE_NAME = "주식일기";
export const SITE_DESCRIPTION =
  "시장 분석부터 종목 탐구, 투자 전략까지. 더 나은 투자 결정을 위한 인사이트를 전합니다.";
