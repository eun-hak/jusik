/**
 * PNG → WebP 변환 스크립트
 * 사용: node scripts/convert-to-webp.mjs [파일경로]
 * 예: node scripts/convert-to-webp.mjs public/img/section2.png
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";

const inputPath = process.argv[2] || "public/img/section2.png";
const inputFull = path.resolve(process.cwd(), inputPath);

if (!fs.existsSync(inputFull)) {
  console.error("파일을 찾을 수 없습니다:", inputFull);
  process.exit(1);
}

const dir = path.dirname(inputFull);
const basename = path.basename(inputFull, path.extname(inputFull));
const outputPath = path.join(dir, `${basename}.webp`);

const inputStats = fs.statSync(inputFull);
const inputSize = (inputStats.size / 1024).toFixed(1);

const info = await sharp(inputFull).metadata();
await sharp(inputFull)
  .webp({ quality: 85 })
  .toFile(outputPath);

const outputStats = fs.statSync(outputPath);
const outputSize = (outputStats.size / 1024).toFixed(1);
const saved = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(0);

console.log(`✓ 변환 완료: ${path.basename(outputPath)}`);
console.log(`  PNG: ${inputSize} KB → WebP: ${outputSize} KB (약 ${saved}% 감소)`);
