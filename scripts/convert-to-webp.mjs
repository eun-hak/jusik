/**
 * PNG/JPEG → WebP 변환 (sharp)
 *
 * 사용법
 * ─────────────────────────────────────────
 * 1) 파일 하나
 *    node scripts/convert-to-webp.mjs public/img/hero.png
 *
 * 2) 파일 여러 개
 *    node scripts/convert-to-webp.mjs a.png b.jpg c.jpeg
 *
 * 3) 폴더 안 이미지 전부 (같은 폴더에 .webp 생성)
 *    node scripts/convert-to-webp.mjs --dir public/img
 *
 * 4) 하위 폴더까지
 *    node scripts/convert-to-webp.mjs --dir public/img --recursive
 *
 * 5) yarn / npm (--dir 는 yarn이 먹지 않게 -- 뒤에)
 *    yarn img:webp public/img/hero.png
 *    yarn img:webp:dir public/img
 *    yarn img:webp -- --dir public/img --recursive
 *
 * 6) Make (프로젝트 루트에서)
 *    make webp FILE=public/img/hero.png
 *    make webp-dir DIR=public/img
 *
 * 7) AI 워터마크(오른쪽·아래 별 등) 잘라내기
 *    node scripts/convert-to-webp.mjs --strip-watermark public/img/id6.png
 *    node scripts/convert-to-webp.mjs --strip-watermark --strip-pct 8 images/foo.png
 *    node scripts/convert-to-webp.mjs --dir public/img --strip-watermark --recursive
 *    (--strip-right-px / --strip-bottom-px 로 픽셀 고정도 가능)
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";
import {
  parseWatermarkArgv,
  sharpAfterStripWatermark,
} from "./lib/strip-ai-watermark.mjs";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg"]);

async function convertOne(inputFull, wm) {
  if (!fs.existsSync(inputFull)) {
    console.error("파일 없음:", inputFull);
    return false;
  }
  const ext = path.extname(inputFull).toLowerCase();
  if (!IMAGE_EXT.has(ext)) {
    console.warn("건너뜀 (png/jpg/jpeg만):", inputFull);
    return false;
  }

  const dir = path.dirname(inputFull);
  const basename = path.basename(inputFull, ext);
  const outputPath = path.join(dir, `${basename}.webp`);
  if (path.resolve(outputPath) === path.resolve(inputFull)) return false;

  const inputStats = fs.statSync(inputFull);
  const inputSize = (inputStats.size / 1024).toFixed(1);

  let pipeline = sharp(inputFull);
  if (wm?.stripWatermark) {
    try {
      pipeline = await sharpAfterStripWatermark(inputFull, wm.stripOpts);
    } catch (e) {
      console.error("워터마크 제거 실패:", inputFull, e.message);
      return false;
    }
  }

  return pipeline
    .webp({ quality: 85 })
    .toFile(outputPath)
    .then(() => {
      const outputStats = fs.statSync(outputPath);
      const outputSize = (outputStats.size / 1024).toFixed(1);
      const saved = (
        ((inputStats.size - outputStats.size) / inputStats.size) *
        100
      ).toFixed(0);
      console.log(`✓ ${path.basename(outputPath)}  (${inputSize} KB → ${outputSize} KB, 약 ${saved}% 감소)`);
      return true;
    })
    .catch((err) => {
      console.error("실패:", inputFull, err.message);
      return false;
    });
}

function collectFilesFromDir(dirAbs, recursive) {
  const out = [];
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dirAbs, e.name);
    if (e.isDirectory() && recursive) {
      out.push(...collectFilesFromDir(full, true));
    } else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase();
      if (IMAGE_EXT.has(ext)) out.push(full);
    }
  }
  return out;
}

const rawArgv = process.argv.slice(2);
if (
  rawArgv.length === 0 ||
  rawArgv[0] === "-h" ||
  rawArgv[0] === "--help"
) {
  console.log(`
PNG/JPEG → WebP

  node scripts/convert-to-webp.mjs <파일들...>
  node scripts/convert-to-webp.mjs --dir <폴더> [--recursive]

  AI 워터마크(오른쪽·아래 가장자리) 제거:
  --strip-watermark              오른쪽·아래 각각 너비·높이의 6% 잘라냄 (기본)
  --strip-pct <1-49>             잘라낼 비율 (%)
  --strip-right-px <n>           오른쪽에서 n px (다른 쪽은 --strip-pct 또는 기본 6%)
  --strip-bottom-px <n>          아래에서 n px

예: yarn img:webp public/img/photo.png
    yarn img:webp -- --strip-watermark public/img/id6.png
    yarn img:webp:dir public/img
    yarn img:webp -- --dir public/img
`);
  process.exit(rawArgv[0] === "-h" || rawArgv[0] === "--help" ? 0 : 1);
}

const { stripWatermark, stripOpts, rest: argv } =
  parseWatermarkArgv(rawArgv);
const wm = { stripWatermark, stripOpts };

if (argv[0] === "--dir") {
  const dirArg = argv[1];
  const recursive = argv.includes("--recursive") || argv.includes("-r");
  if (!dirArg) {
    console.error("--dir 뒤에 폴더 경로를 넣어주세요.");
    process.exit(1);
  }
  const dirAbs = path.resolve(process.cwd(), dirArg);
  if (!fs.existsSync(dirAbs) || !fs.statSync(dirAbs).isDirectory()) {
    console.error("폴더가 아니거나 없습니다:", dirAbs);
    process.exit(1);
  }
  const files = collectFilesFromDir(dirAbs, recursive);
  if (files.length === 0) {
    console.log("변환할 png/jpg/jpeg가 없습니다.");
    process.exit(0);
  }
  if (stripWatermark) {
    console.log(
      "워터마크 제거(가장자리 크롭): 활성화 (--strip-pct 기본 6%)\n"
    );
  }
  console.log(`${files.length}개 변환 중...\n`);
  let ok = 0;
  for (const f of files) {
    if (await convertOne(f, wm)) ok++;
  }
  console.log(`\n완료: ${ok}/${files.length}`);
  process.exit(ok < files.length ? 1 : 0);
}

const files = argv.map((p) => path.resolve(process.cwd(), p));
if (stripWatermark) {
  console.log(
    "워터마크 제거(가장자리 크롭): 활성화 (--strip-pct 기본 6%)\n"
  );
}
let ok = 0;
for (const f of files) {
  if (await convertOne(f, wm)) ok++;
}
process.exit(ok < files.length ? 1 : 0);
