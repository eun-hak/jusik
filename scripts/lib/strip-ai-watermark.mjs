/**
 * AI 생성 이미지 오른쪽·아래 코너 워터마크(별/로고 등) 제거용.
 * 모서리만 지우는 게 아니라, 오른쪽 끝 전체·아래 끝 전체를 같은 두께만큼 잘라 냅니다.
 * (실제 콘텐츠가 가장자리에 붙어 있으면 함께 잘릴 수 있으니 --strip-pct 로 조절)
 */
import sharp from "sharp";

/**
 * @param {string} inputPath
 * @param {{ pct?: number; rightPx?: number; bottomPx?: number }} opts
 * @returns {import("sharp").Sharp} extract 적용된 파이프라인 (이후 .webp() 등 체인)
 */
function trimFromEdge(dim, pxOpt, pct) {
  const p = pct ?? 6;
  if (pxOpt != null) {
    return Math.min(dim - 1, Math.max(1, pxOpt));
  }
  return Math.max(1, Math.min(dim - 1, Math.round((dim * p) / 100)));
}

export async function sharpAfterStripWatermark(inputPath, opts = {}) {
  const pct = opts.pct ?? 6;
  const meta = await sharp(inputPath).metadata();
  const width = meta.width;
  const height = meta.height;
  if (!width || !height) {
    throw new Error(`이미지 크기를 읽을 수 없습니다: ${inputPath}`);
  }

  const right = trimFromEdge(width, opts.rightPx, pct);
  const bottom = trimFromEdge(height, opts.bottomPx, pct);

  const newW = Math.max(1, width - right);
  const newH = Math.max(1, height - bottom);

  return sharp(inputPath).extract({
    left: 0,
    top: 0,
    width: newW,
    height: newH,
  });
}

/**
 * CLI 인자에서 워터마크 옵션 파싱. 나머지 인자 배열 반환.
 * @param {string[]} argv process.argv.slice(2) 와 동일 형태
 */
export function parseWatermarkArgv(argv) {
  let stripWatermark = false;
  let stripPct = 6;
  /** @type {number | undefined} */
  let stripRightPx;
  /** @type {number | undefined} */
  let stripBottomPx;
  const rest = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--strip-watermark") {
      stripWatermark = true;
      continue;
    }
    if (a === "--strip-pct") {
      const n = Number(argv[++i]);
      if (Number.isFinite(n) && n > 0 && n < 50) stripPct = n;
      continue;
    }
    if (a === "--strip-right-px") {
      const n = Number(argv[++i]);
      if (Number.isFinite(n) && n > 0) stripRightPx = n;
      continue;
    }
    if (a === "--strip-bottom-px") {
      const n = Number(argv[++i]);
      if (Number.isFinite(n) && n > 0) stripBottomPx = n;
      continue;
    }
    rest.push(a);
  }

  return {
    stripWatermark,
    stripOpts: {
      pct: stripPct,
      rightPx: stripRightPx,
      bottomPx: stripBottomPx,
    },
    rest,
  };
}
