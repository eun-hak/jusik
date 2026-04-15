import fs from "fs";
import path from "path";
import type { Topic } from "./types";

const TOPICS_PATH = path.join(process.cwd(), ".pipeline-topics.json");

const SEED_TOPICS: Topic[] = [
  { id: "t01", keyword: "반도체 산업 구조", description: "메모리 vs 비메모리, 팹리스 vs 파운드리, 전공정 vs 후공정 등 반도체 산업의 밸류체인과 핵심 구조", category: "산업 분석", used: false },
  { id: "t02", keyword: "2차전지 산업 구조", description: "양극재, 음극재, 분리막, 전해질 등 배터리 소재와 완성 셀까지의 밸류체인", category: "산업 분석", used: false },
  { id: "t03", keyword: "바이오 제약 산업 구조", description: "신약 개발 과정, 전임상부터 임상 1상~3상, 허가까지의 단계별 구조", category: "산업 분석", used: false },
  { id: "t04", keyword: "플랫폼 IT 산업 구조", description: "네트워크 효과, 구독 경제, 광고 수익 모델 등 IT 플랫폼 기업의 수익 구조", category: "산업 분석", used: false },
  { id: "t05", keyword: "금융 산업 구조", description: "은행, 보험, 증권사의 수익 구조와 각각의 핵심 지표(NIM, 손해율, 수수료 수익 등)", category: "산업 분석", used: false },
  { id: "t06", keyword: "외국인 매매 동향 해석", description: "외국인이 사면 오르는 것처럼 보이는 이유, 실제 외국인 매매 데이터를 해석하는 법", category: "수급 해석", used: false },
  { id: "t07", keyword: "기관 투자자 매매 해석", description: "기관이 사고파는 이유, 프로그램 매매, 기관 수급이 의미하는 것", category: "수급 해석", used: false },
  { id: "t08", keyword: "공매도 뜻과 시장 영향", description: "공매도가 왜 존재하는지, 주가에 어떤 영향을 주는지, 공매도 잔고 해석법", category: "수급 해석", used: false },
  { id: "t09", keyword: "이동평균선 보는 법", description: "5일선, 20일선, 60일선, 120일선의 의미와 골든크로스/데드크로스 해석", category: "차트 기초", used: false },
  { id: "t10", keyword: "거래량과 주가의 관계", description: "거래량이 왜 주가보다 선행하는지, 거래량 급증/감소가 의미하는 것", category: "차트 기초", used: false },
  { id: "t11", keyword: "배당수익률과 배당성향 차이", description: "배당수익률과 배당성향의 개념 차이, 배당 투자 시 어떤 지표를 봐야 하는지", category: "배당 투자", used: false },
  { id: "t12", keyword: "배당락일 뜻과 매수 타이밍", description: "배당 받으려면 언제까지 사야 하는지, 배당락일 전후 주가 움직임", category: "배당 투자", used: false },
  { id: "t13", keyword: "경기 사이클과 투자 전략", description: "확장, 정점, 수축, 저점 각 국면에서 어떤 자산이 유리한지", category: "거시경제", used: false },
  { id: "t14", keyword: "인플레이션과 주식 관계", description: "물가 상승기에 주식시장은 어떻게 되는지, 인플레이션 수혜주와 피해주", category: "거시경제", used: false },
  { id: "t15", keyword: "환율과 주식시장 관계", description: "원달러 환율이 왜 주가에 영향을 주는지, 환율 상승/하락 시 수출주와 내수주 반응", category: "거시경제", used: false },
  { id: "t16", keyword: "분산 투자 뜻과 방법", description: "왜 분산 투자가 중요한지, 자산 배분과 종목 분산의 차이", category: "투자 전략", used: false },
  { id: "t17", keyword: "적립식 투자 DCA", description: "Dollar Cost Averaging이 왜 효과적인지, 일시 투자와의 비교", category: "투자 전략", used: false },
  { id: "t18", keyword: "시가총액 뜻과 해석", description: "주가가 높다고 비싼 주식이 아닌 이유, 시가총액으로 기업 규모 비교하는 법", category: "주식 기초", used: false },
  { id: "t19", keyword: "유상증자 무상증자 차이", description: "증자가 주가에 미치는 영향, 유상증자가 악재인 이유, 무상증자는 왜 호재처럼 보이는지", category: "주식 기초", used: false },
  { id: "t20", keyword: "실적 시즌 어닝 서프라이즈", description: "어닝 서프라이즈와 어닝 쇼크의 차이, 실적이 좋은데 왜 주가가 빠지는지", category: "실전 해석", used: false },
];

export function loadTopics(): Topic[] {
  if (!fs.existsSync(TOPICS_PATH)) {
    fs.writeFileSync(TOPICS_PATH, JSON.stringify(SEED_TOPICS, null, 2), "utf-8");
    return structuredClone(SEED_TOPICS);
  }
  return JSON.parse(fs.readFileSync(TOPICS_PATH, "utf-8"));
}

export function pickNextTopic(): Topic | null {
  const topics = loadTopics();
  return topics.find((t) => !t.used) ?? null;
}

export function markTopicUsed(topicId: string): void {
  const topics = loadTopics();
  const target = topics.find((t) => t.id === topicId);
  if (target) target.used = true;
  fs.writeFileSync(TOPICS_PATH, JSON.stringify(topics, null, 2), "utf-8");
}
