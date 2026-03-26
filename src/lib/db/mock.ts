import fs from "fs";
import path from "path";
import type { Article } from "./types";
import article1 from "./article-1.json";
import article2 from "./article-2.json";
import article3 from "./article-3.json";
import article4 from "./article-4.json";
import article7 from "./article-7.json";
import article8 from "./article-8.json";
import article9 from "./article-9.json";
import article11 from "./article-11.json";
import article12 from "./article-12.json";
import article13 from "./article-13.json";
import article14 from "./article-14.json";
import article15 from "./article-15.json";
import article16 from "./article-16.json";

const META_KEY = "_meta";

interface DbMeta {
  deletedSeedIds?: string[];
}

/**
 * 목업 DB (JSON 파일 기반)
 *
 * - .mock-db.json: 실제 저장소 (관리자에서 작성/수정/삭제한 글이 여기 저장됨)
 * - seed: mock.ts에 하드코딩된 초기 데이터
 *
 * 연동 방식:
 * 1. IDE에서 mock.ts의 seed 배열에 새 글을 추가하면 → 다음 요청 시 자동 병합되어 관리자/리스트에 표시됨
 * 2. 관리자 페이지에서 작성/수정/삭제한 글은 .mock-db.json에 저장됨
 * 3. seed에 있는 id가 .mock-db.json에 없으면 병합 (seed는 "추가 소스" 역할)
 * 4. 관리자에서 seed 글을 삭제하면 deletedSeedIds에 기록 → seed에 있어도 다시 병합되지 않음 (삭제 유지)
 * 5. 같은 id가 .mock-db.json에 이미 있으면 시드 글은 무시됨 → 시드에 넣는 신규 글 id는 파일에 없는 번호를 쓸 것
 */
const DB_FILE = path.join(process.cwd(), ".mock-db.json");

export function getSeedIds(): Set<string> {
  return new Set(seed.map((a) => a.id));
}

const seed: Article[] = [
  article1 as Article,
  article2 as Article,
  article3 as Article,
  article4 as Article,
  article7 as Article,
  article8 as Article,
  article9 as Article,
  article11 as Article,
  article12 as Article,
  article13 as Article,
  article14 as Article,
  article15 as Article,
  article16 as Article,
];

export function readDb(): Map<string, Article> {
  let map = new Map<string, Article>();
  let meta: DbMeta = {};

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const obj = JSON.parse(raw) as Record<string, unknown>;
      meta = (obj[META_KEY] as DbMeta) ?? {};
      const deletedIds = new Set(meta.deletedSeedIds ?? []);
      for (const [k, v] of Object.entries(obj)) {
        if (k === META_KEY || !v || typeof v !== "object") continue;
        map.set(k, v as Article);
      }
    }
  } catch {
    // 파일 손상 시 초기화
  }

  const deletedIds = new Set(meta.deletedSeedIds ?? []);

  // seed에 있지만 map에 없고, 삭제 목록에 없는 글만 병합
  let merged = false;
  for (const article of seed) {
    if (deletedIds.has(article.id)) continue;
    if (!map.has(article.id)) {
      map.set(article.id, article);
      merged = true;
    }
  }

  // 최초 실행: 파일이 없었으면 시드 저장
  if (!fs.existsSync(DB_FILE)) {
    writeDb(map);
  } else if (merged) {
    writeDb(map);
  }

  return map;
}

export function writeDb(
  map: Map<string, Article>,
  addDeletedSeedIds?: string[]
): void {
  let meta: DbMeta = {};
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const obj = JSON.parse(raw) as Record<string, unknown>;
      meta = (obj[META_KEY] as DbMeta) ?? {};
    }
  } catch {
    // 무시
  }
  if (addDeletedSeedIds?.length) {
    const set = new Set(meta.deletedSeedIds ?? []);
    addDeletedSeedIds.forEach((id) => set.add(id));
    meta = { ...meta, deletedSeedIds: Array.from(set) };
  }
  const obj: Record<string, unknown> = { [META_KEY]: meta, ...Object.fromEntries(map) };
  fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2), "utf-8");
}
