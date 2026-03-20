/**
 * images/ 안의 png·jpg·jpeg → public/img/*.webp
 *
 * yarn webp (package.json) — WebP 변환 + AI 워터마크(오른쪽·아래) 가장자리 크롭 기본
 * yarn webp:plain — 크롭 없이 WebP만
 *
 * 수동 (Windows는 환경변수 앞에 붙이는 방식이 안 되므로 --strip-watermark 권장):
 *   node scripts/images-to-img-webp.mjs --strip-watermark
 *   node scripts/images-to-img-webp.mjs --strip-watermark --strip-pct 8
 *   (Unix) STRIP_AI_WATERMARK=1 node scripts/images-to-img-webp.mjs
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";
import {
  parseWatermarkArgv,
  sharpAfterStripWatermark,
} from "./lib/strip-ai-watermark.mjs";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "images");
const OUT = path.join(ROOT, "public", "img");
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg"]);

const { stripWatermark: stripArg, stripOpts, rest: argvRest } =
  parseWatermarkArgv(process.argv.slice(2));
if (argvRest.length > 0) {
  console.warn("알 수 없는 인자 무시:", argvRest.join(" "));
}
const stripWatermark =
  stripArg || process.env.STRIP_AI_WATERMARK === "1";
const wm = { stripWatermark, stripOpts };

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listImages(full));
    else if (IMAGE_EXT.has(path.extname(e.name).toLowerCase())) out.push(full);
  }
  return out;
}

if (!fs.existsSync(SRC)) {
  console.error("images 폴더가 없습니다. 프로젝트 루트에 images/ 를 만들고 사진을 넣어주세요.");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

const files = listImages(SRC);
if (files.length === 0) {
  console.log("images/ 안에 png, jpg, jpeg 파일이 없습니다.");
  process.exit(0);
}

if (stripWatermark) {
  console.log(
    "워터마크 제거(가장자리 크롭): 활성화 (기본 각 변 6%, STRIP_AI_WATERMARK=1 또는 --strip-watermark)\n"
  );
}

let ok = 0;
for (const inputFull of files) {
  const rel = path.relative(SRC, inputFull);
  const base = path.basename(inputFull, path.extname(inputFull));
  const relDir = path.dirname(rel);
  const outDir = relDir === "." ? OUT : path.join(OUT, relDir);
  fs.mkdirSync(outDir, { recursive: true });
  const outputPath = path.join(outDir, `${base}.webp`);

  try {
    let pipeline = sharp(inputFull);
    if (wm.stripWatermark) {
      pipeline = await sharpAfterStripWatermark(inputFull, wm.stripOpts);
    }
    await pipeline.webp({ quality: 85 }).toFile(outputPath);
    console.log("✓", path.relative(ROOT, outputPath));
    ok++;
  } catch (err) {
    console.error("✗", rel, err.message);
  }
}

console.log(`\n완료: ${ok}/${files.length} → public/img/`);
