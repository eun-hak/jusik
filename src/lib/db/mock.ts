import fs from "fs";
import path from "path";
import type { Article } from "./types";

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
 */
const DB_FILE = path.join(process.cwd(), ".mock-db.json");

export function getSeedIds(): Set<string> {
  return new Set(seed.map((a) => a.id));
}

const seed: Article[] = [
  {
    id: "1",
    slug: "2024-semiconductor-buy-now",
    title: "2024년 반도체 섹터, 지금 매수해도 될까?",
    subtitle:
      "AI 수요 폭증으로 반도체 업종이 다시 주목받고 있습니다. 삼성전자, SK하이닉스를 중심으로 밸류에이션과 실적 전망을 짚어봅니다.",
    description:
      "2024년 반도체 섹터 전망 분석. AI 열풍에 따른 HBM 수요 증가 여파와 삼성전자, SK하이닉스 밸류에이션 분석 및 투자 전략.",
    category: "분석",
    date: "2024.01.15",
    publishedTime: "2024-01-15T09:00:00+09:00",
    readTime: "8분",
    author: "주식일기",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    tags: ["반도체", "삼성전자", "SK하이닉스", "AI", "분석"],
    status: "published",
    createdAt: "2024-01-15T09:00:00+09:00",
    updatedAt: "2024-01-15T09:00:00+09:00",
    content: [
      {
        id: "b1",
        type: "p",
        text: "2023년 하반기부터 반도체 섹터가 강하게 반등하고 있습니다. AI 열풍이 HBM 수요를 폭발적으로 끌어올리며, 그 수혜를 가장 직접적으로 받는 SK하이닉스가 52주 신고가를 경신했습니다.",
      },
      { id: "b2", type: "h2", text: "왜 지금 반도체인가" },
      {
        id: "b3",
        type: "p",
        text: "ChatGPT 이후 생성형 AI 서비스가 본격적으로 상용화되면서, 대규모 언어 모델(LLM)을 구동하는 데이터센터의 GPU·HBM 수요가 폭발적으로 늘고 있습니다.",
      },
      {
        id: "b4",
        type: "quote",
        text: "HBM은 일반 DRAM 대비 ASP(평균 판매가)가 5배 이상 높습니다. SK하이닉스는 HBM3E 독점 공급으로 영업이익률이 빠르게 회복될 전망입니다.",
      },
      { id: "b5", type: "h2", text: "밸류에이션: 지금도 싼가" },
      {
        id: "b6",
        type: "p",
        text: "삼성전자는 현재 PBR 1.4배 수준으로 역사적 저점 구간에 있습니다. 반도체 업황 회복과 함께 HBM 사업 경쟁력 확보가 확인된다면, 리레이팅 여지가 충분합니다.",
      },
      { id: "b7", type: "h3", text: "리스크 요인" },
      {
        id: "b8",
        type: "p",
        text: "단기적으로는 미국의 대중 반도체 수출 규제 강화, 고객사의 AI 투자 사이클 둔화 가능성, 그리고 삼성전자의 HBM3E 품질 인증 지연이 리스크입니다.",
      },
      { id: "b9", type: "h2", text: "결론: 분할 매수 전략 추천" },
      {
        id: "b10",
        type: "p",
        text: "2024년 상반기는 반도체 업사이클 초입 단계입니다. 단기 급등 부담이 있는 SK하이닉스보다는, 상대적으로 저평가된 삼성전자를 분할 매수하는 전략을 권장합니다.",
      },
    ],
  },
  {
    id: "2",
    slug: "how-to-get-adsense-approval-seo-guide",
    title: "구글 애드센스 승인받는 글쓰기 핵심 전략 (SEO 최적화 완벽 가이드)",
    subtitle:
      "애드센스 고시를 한 번에 통과하는 비결. 구글 SEO 친화적인 글 구조, 키워드 배치, 가독성 높은 콘텐츠 작성법을 모두 공개합니다.",
    description:
      "구글 애드센스 한 번에 승인받는 글쓰기 비결! 구글 봇이 좋아하는 SEO 친화적인 문서 구조 설계, H 태그 활용법, 핵심 키워드 배치 전략까지 완벽하게 정리했습니다.",
    category: "분석",
    date: "2024.03.10",
    publishedTime: "2024-03-10T10:00:00+09:00",
    readTime: "7분",
    author: "주식일기",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    tags: ["애드센스", "승인", "SEO", "검색엔진최적화", "블로그"],
    status: "published",
    createdAt: "2024-03-10T10:00:00+09:00",
    updatedAt: "2024-03-10T10:00:00+09:00",
    content: [
      {
        id: "c1",
        type: "p",
        text: "블로그 수익화의 첫걸음, 바로 '애드센스 승인'입니다. 요즘은 애드센스 자체의 기준이 높아져서 흔히 '애드센스 고시'라고도 부르는데요.",
      },
      {
        id: "c2",
        type: "h2",
        text: "1. 구글 봇(Bot)이 이해하기 쉬운 뼈대: H 태그 활용",
      },
      {
        id: "c3",
        type: "p",
        text: "구글의 크롤러는 사람처럼 글의 맥락을 이미지만으로 파악하지 못합니다. 대신 HTML 문서의 구조, 특히 헤딩(H 태그)를 통해 이 문서가 어떤 내용을 다루고 있는지 파악합니다.",
      },
      {
        id: "c4",
        type: "quote",
        text: "글의 기둥이 되는 H2(대제목), 세부 내용을 다루는 H3(중제목)를 적절한 위계로 사용하는 것이 핵심입니다.",
      },
      { id: "c5", type: "h2", text: "2. 본문 분량과 퀄리티 유지" },
      {
        id: "c6",
        type: "p",
        text: "콘텐츠의 품질(Quality)은 애드센스 승인을 결정짓는 가장 강력한 요소입니다. 의미 없는 단어의 나열이나 다른 블로그의 글을 단순 복사하는 것은 오히려 승인 대기 시간만 길어지게 할 뿐입니다.",
      },
      { id: "c7", type: "h3", text: "최소 1,500자 이상의 글자 수" },
      {
        id: "c8",
        type: "p",
        text: "구글은 하나의 문서를 완전한 정보를 담고 있는 백과사전처럼 취급합니다. 방문자가 내 블로그 글 하나만 읽고도 해당 주제에 대한 답을 얻을 수 있어야 합니다.",
      },
      { id: "c9", type: "h2", text: "3. 정확한 정보와 체류 시간" },
      {
        id: "c10",
        type: "p",
        text: "결국 구글 애드센스는 '광고 플랫폼'입니다. 광고주를 위해 체류 시간이 길고 방문자의 집중도가 높은 웹사이트에 광고를 내보내려고 합니다.",
      },
    ],
  },
  {
    id: "3",
    slug: "us-10y-treasury-yield-importance",
    title: "미국 10년물 국채금리가 중요한 이유",
    subtitle: "주식보다 먼저 확인되는 금융 시장 핵심 지표",
    description:
      "미국 10년물 국채금리가 왜 중요한지 쉽게 설명합니다. 국채금리 뜻, 10년물 금리 의미, 주식 시장과의 관계까지 금융 뉴스에서 자주 등장하는 핵심 지표를 정리했습니다.",
    category: "분석",
    date: "2025.03.16",
    publishedTime: "2025-03-16T09:00:00+09:00",
    readTime: "9분",
    author: "주식일기",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    tags: ["국채금리", "10년물", "미국국채", "금리", "주식시장"],
    status: "published",
    createdAt: "2025-03-16T09:00:00+09:00",
    updatedAt: "2025-03-16T09:00:00+09:00",
    content: [
      { id: "t1", type: "h2", text: "1. 개요" },
      {
        id: "t2",
        type: "p",
        text: "미국 10년물 국채금리는 경제 뉴스에서 자주 등장하지만 왜 중요한지 연결하기 어려운 숫자로 느껴지는 경우가 많습니다.",
      },
      {
        id: "t3",
        type: "p",
        text: "금융 시장에서는 이 금리가 주식보다 먼저 확인되는 지표로 자주 언급됩니다. 그 이유는 채권 시장이 주식 시장보다 규모가 크고, 경제 전망이 빠르게 반영되는 특징이 있기 때문입니다.",
      },
      {
        id: "t4",
        type: "p",
        text: "특히 다음과 같은 상황에서 이 지표가 함께 언급됩니다: 금리 변화, 경제 성장 전망, 주식 시장 자금 흐름. 이 글에서는 국채금리 뜻부터 시작해 왜 10년물 금리가 중요한지, 그리고 주식 시장과 어떤 관계가 있는지 핵심만 정리합니다.",
      },
      { id: "t5", type: "h2", text: "2. 국채금리 뜻 쉽게 이해하기" },
      {
        id: "t6",
        type: "p",
        text: "먼저 국채금리의 기본 개념을 살펴보겠습니다. 국채는 정부가 자금을 조달하기 위해 발행하는 채권입니다. 투자자는 국채를 매입하고 그 대가로 일정한 이자를 받습니다.",
      },
      {
        id: "t7",
        type: "p",
        text: "즉 국채금리는 국채 투자자가 받는 이자율을 의미합니다. 예를 들어 미국 정부가 발행한 국채에 투자하면 만기까지 일정한 금리를 기준으로 이자를 받게 됩니다.",
      },
      {
        id: "t8",
        type: "p",
        text: "대표적인 미국 국채 종류는 2년물, 5년물, 10년물, 30년물이 있습니다. 이 가운데 금융 시장에서 가장 널리 참고되는 지표가 미국 10년물 국채금리입니다.",
      },
      { id: "t9", type: "h2", text: "3. 왜 하필 10년물 금리일까" },
      {
        id: "t10",
        type: "p",
        text: "많은 투자자들이 궁금해하는 질문이 있습니다. 왜 하필 10년물 금리가 중요할까요? 그 이유는 10년물 금리가 단기 정책 금리와 장기 경제 전망을 동시에 반영하는 구간으로 여겨지기 때문입니다.",
      },
      {
        id: "t11",
        type: "p",
        text: "2년물 금리는 중앙은행 기준금리 영향이 크고, 10년물 금리는 경제 성장 기대를 반영하며, 30년물 금리는 장기 인플레이션 전망을 반영합니다. 10년물 금리는 경제 전망을 비교적 균형 있게 반영하는 금리로 해석되는 경우가 많습니다.",
      },
      {
        id: "t12",
        type: "p",
        text: "그래서 금융 시장에서는 대출 금리, 모기지 금리, 기업 자금 조달 금리 등이 10년물 국채금리를 기준으로 움직이는 경우가 많습니다.",
      },
      { id: "t13", type: "h2", text: "4. 주식 시장과의 관계" },
      {
        id: "t14",
        type: "p",
        text: "미국 10년물 국채금리는 주식 시장과 함께 언급되는 경우가 많습니다. 그 이유는 금리가 기업 가치 평가 방식에 영향을 줄 수 있기 때문입니다. 특히 금융 시장에서는 금리와 성장주의 관계가 자주 설명됩니다.",
      },
      {
        id: "t15",
        type: "p",
        text: "성장주는 금리 상승 시 미래 가치 평가가 낮아질 수 있고, 가치주는 상대적으로 영향이 작을 수 있습니다. 성장주는 미래 이익 기대가 큰 기업입니다. 금리가 상승하면 미래 현금 흐름을 현재 가치로 계산할 때 사용되는 할인율이 높아집니다. 이 과정에서 성장주의 가치 평가가 낮아질 수 있다는 설명이 자주 등장합니다.",
      },
      {
        id: "t16",
        type: "quote",
        text: "금리 상승이 항상 부정적인 신호로 해석되는 것은 아닙니다. 금리가 상승하는 이유가 경제 성장 기대일 수도 있기 때문입니다.",
      },
      {
        id: "t17",
        type: "p",
        text: "경제 성장 기대 상승, 소비 증가, 기업 실적 개선 같은 상황에서는 금리가 상승하는 동시에 주식 시장이 상승하는 흐름이 나타나기도 합니다.",
      },
      {
        id: "t18",
        type: "h2",
        text: "5. 직장인 투자자가 참고하면 좋은 상황",
      },
      {
        id: "t19",
        type: "p",
        text: "개인 투자자가 매일 10년물 금리를 확인할 필요는 없습니다. 하지만 FOMC 회의 전후, CPI 발표 이후, 고용 지표 발표 이후, 시장 변동성이 커질 때에는 함께 확인되는 경우가 많습니다.",
      },
      {
        id: "t20",
        type: "p",
        text: "특히 성장주 비중이 높은 시장에서는 금리 변화가 더 자주 언급되는 경향이 있습니다. 따라서 이 지표는 투자 판단보다는 시장 분위기를 이해하는 참고 지표로 활용되는 경우가 많습니다.",
      },
      {
        id: "t21",
        type: "h2",
        text: "6. 투자자가 자주 오해하는 부분",
      },
      {
        id: "t22",
        type: "h3",
        text: "금리가 오르면 주식은 반드시 하락할까",
      },
      {
        id: "t23",
        type: "p",
        text: "이렇게 단순하게 해석되지는 않습니다. 금리 상승의 원인은 크게 두 가지로 나눌 수 있습니다. 인플레이션 상승일 때는 부담 요인으로 해석되는 경우가 많고, 경제 성장 기대일 때는 긍정적인 신호로 해석되는 경우가 있습니다. 따라서 금리 수준만 보기보다 금리가 움직이는 배경을 함께 살펴보는 것이 중요합니다.",
      },
      {
        id: "t24",
        type: "h3",
        text: "금리 하나만으로 시장을 판단할 수 있을까",
      },
      {
        id: "t25",
        type: "p",
        text: "금리는 중요한 지표이지만 단일 지표만으로 시장 흐름을 설명하기는 어렵습니다. 투자자들은 보통 인플레이션 지표(CPI), 중앙은행 기준금리, 경제 성장률, 고용 지표를 함께 확인합니다. 이러한 데이터를 함께 보면 경제 상황을 더 입체적으로 이해할 수 있습니다.",
      },
      { id: "t26", type: "h2", text: "7. 핵심 정리" },
      {
        id: "t27",
        type: "p",
        text: "미국 10년물 국채금리는 글로벌 금융 시장에서 널리 참고되는 금리 지표입니다. 미국 10년물 국채금리는 금융 시장의 대표적인 기준 금리이며, 경제 성장 전망과 인플레이션 기대가 반영됩니다. 주식 시장 자금 흐름을 이해할 때 참고되는 지표이고, 성장주와 가치주에 다른 영향을 설명할 때 자주 언급됩니다.",
      },
      {
        id: "t28",
        type: "p",
        text: "경제 뉴스에서 자주 등장하지만 의미를 바로 연결하기 어려운 숫자로 느껴질 수 있습니다. 하지만 이 지표를 이해하면 왜 금융 시장에서 주식보다 먼저 확인되는 지표로 언급되는지를 자연스럽게 이해할 수 있습니다.",
      },
      { id: "t29", type: "h2", text: "FAQ" },
      {
        id: "t30",
        type: "h3",
        text: "Q1. 미국 10년물 국채금리는 어디에서 확인할 수 있습니까?",
      },
      {
        id: "t31",
        type: "p",
        text: "금융 뉴스, 경제 데이터 사이트, 증권사 앱 등에서 확인할 수 있습니다. 보통 US10Y 또는 Treasury Yield라는 이름으로 표시됩니다.",
      },
      {
        id: "t32",
        type: "h3",
        text: "Q2. 금리가 상승하면 성장주는 항상 하락합니까?",
      },
      {
        id: "t33",
        type: "p",
        text: "반드시 그렇지는 않습니다. 금리 상승의 원인과 경제 상황에 따라 시장 반응이 달라질 수 있습니다.",
      },
      {
        id: "t34",
        type: "h3",
        text: "Q3. 개인 투자자도 이 지표를 확인해야 합니까?",
      },
      {
        id: "t35",
        type: "p",
        text: "필수 지표라고 보기는 어렵습니다. 하지만 시장 분위기와 자금 흐름을 이해하는 참고 지표로 활용되는 경우가 많습니다.",
      },
    ],
  },
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
