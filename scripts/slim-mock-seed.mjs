/**
 * mock.ts에서 인라인 seed 본문을 제거하고 article-*.json import만 남깁니다.
 * 먼저 extract-inline-articles.mjs 실행 후 이 스크립트를 실행하세요.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mockPath = path.join(__dirname, "..", "src/lib/db/mock.ts");

const lines = fs.readFileSync(mockPath, "utf-8").split("\n");

const articleImports = [
  'import article1 from "./article-1.json";',
  'import article2 from "./article-2.json";',
  'import article3 from "./article-3.json";',
  'import article4 from "./article-4.json";',
  'import article7 from "./article-7.json";',
  'import article8 from "./article-8.json";',
  'import article9 from "./article-9.json";',
  'import article11 from "./article-11.json";',
  'import article12 from "./article-12.json";',
  'import article13 from "./article-13.json";',
  'import article14 from "./article-14.json";',
].join("\n");

const seedBlock = [
  "const seed: Article[] = [",
  "  article1 as Article,",
  "  article2 as Article,",
  "  article3 as Article,",
  "  article4 as Article,",
  "  article7 as Article,",
  "  article8 as Article,",
  "  article9 as Article,",
  "  article11 as Article,",
  "  article12 as Article,",
  "  article13 as Article,",
  "  article14 as Article,",
  "];",
].join("\n");

if (!lines[33]?.includes("const seed: Article[] = ["))
  throw new Error("Unexpected mock.ts: line 34 should be const seed");
if (!lines[1313]?.includes("export function readDb"))
  throw new Error("Unexpected mock.ts: readDb line number changed");

const out = [
  lines.slice(0, 3).join("\n"),
  articleImports,
  lines.slice(7, 33).join("\n"),
  seedBlock,
  lines.slice(1313).join("\n"),
].join("\n");

fs.writeFileSync(mockPath, out, "utf-8");
console.log("Updated", mockPath);
