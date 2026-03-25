/**
 * mock.ts의 seed 배열에서 인라인 글 객체를 잘라 JSON 파일로 저장합니다.
 * 사용: node scripts/extract-inline-articles.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mockPath = path.join(root, "src/lib/db/mock.ts");
const dbDir = path.join(root, "src/lib/db");

const lines = fs.readFileSync(mockPath, "utf-8").split("\n");

/** 1-based inclusive line numbers from mock.ts (현재 버전 기준) */
const RANGES = [
  { file: "article-1.json", start: 35, end: 90 },
  { file: "article-2.json", start: 91, end: 150 },
  { file: "article-3.json", start: 151, end: 322 },
  { file: "article-4.json", start: 323, end: 546 },
  { file: "article-7.json", start: 547, end: 808 },
  { file: "article-8.json", start: 809, end: 1125 },
  { file: "article-9.json", start: 1126, end: 1307 },
];

function sliceObjectLiteral(startLine, endLine) {
  const slice = lines.slice(startLine - 1, endLine).join("\n");
  const trimmed = slice.trimEnd();
  // seed 배열 원소는 `  },` 로 끝남 — 마지막 쉼표만 제거해 단일 객체 리터럴로 만듦
  if (!/}\s*,\s*$/.test(trimmed)) {
    throw new Error(`Expected }, at end of lines ${startLine}-${endLine}`);
  }
  return trimmed.replace(/,\s*$/, "");
}

for (const { file, start, end } of RANGES) {
  const literal = sliceObjectLiteral(start, end);
  let obj;
  try {
    obj = new Function(`return (${literal})`)();
  } catch (e) {
    console.error(`Failed to parse ${file}:`, e.message);
    process.exit(1);
  }
  const outPath = path.join(dbDir, file);
  fs.writeFileSync(outPath, JSON.stringify(obj, null, 2) + "\n", "utf-8");
  console.log("Wrote", outPath);
}
