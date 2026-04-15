# 자동 글 발행 파이프라인

수동으로 하던 **기획 → 학습(리서치) → 작성 → 검수 → 이미지** 흐름을 서버에서 한 번에 실행해, 하루 1편(또는 필요 시 수동 트리거)으로 블로그에 **발행(`published`)** 상태로 올리기 위한 설계 문서입니다.

---

## 1. 기획 의도

| 목표 | 설명 |
|------|------|
| **반복 작업 자동화** | ChatGPT 등에서 여러 번 나눠 하던 단계를 API로 연결해 한 파이프라인으로 묶음 |
| **품질·톤 유지** | 기획(검색·SEO)·작가·편집자 역할을 각각 전용 프롬프트로 분리해, 블로그 톤과 금지 사항(종목 추천 등)을 일관되게 적용 |
| **비용·속도 균형** | 텍스트는 OpenRouter로 모델을 단계별로 나누고, 이미지는 Google GenAI(별도 키)로 생성 |
| **발행 단위 제어** | 주제는 `.pipeline-topics.json` 풀에서 **`used: false`인 것만** 순서대로 소비해, 무작위 전체 자동이 아니라 **커리큘럼/우선순위를 파일로 관리** |
| **운영 연동** | 배포 서버의 **cron**이 HTTP로 API만 호출하면 되도록 구성 (스크립트를 서버에 따로 둘 필요 없음) |

---

## 2. 동작 방식 (파이프라인 개요)

`src/lib/pipeline/pipeline.ts`의 `runPipeline()`이 아래 순서로 실행됩니다.

### 2.1 주제 선택

- `loadTopics()`가 프로젝트 루트의 **`.pipeline-topics.json`**을 읽습니다.
- 파일이 없으면 `topics.ts`에 정의된 `SEED_TOPICS`로 파일을 **최초 1회 생성**합니다.
- `pickNextTopic()`은 배열에서 **`used === false`인 첫 번째 주제**를 고릅니다. 없으면 오류로 종료합니다.

### 2.2 1/5 기획 (Planner)

- **모델:** OpenRouter — `google/gemini-2.5-flash` (`tier: "fast"`)
- 입력: 선택된 `Topic`, 이미 발행된 글 제목 목록(중복·유사 제목 완화용)
- 출력: `PlanResult` JSON (SEO 키워드, 슬러그, 목차 구조, 검색 의도 등)
- 프롬프트: `src/lib/pipeline/prompts/planner.ts`

### 2.3 2/5 학습 / 리서치 (Researcher)

- **모델:** 동일하게 `fast`
- 입력: 기획 결과
- 출력: 자유 텍스트(다음 단계 작성용 배경 정리)
- 프롬프트: `prompts/researcher.ts`

### 2.4 3/5 작성 (Writer)

- **모델:** OpenRouter — `anthropic/claude-sonnet-4` (`tier: "quality"`)
- 입력: 기획 + 리서치
- 출력: `ArticleDraft` JSON (제목, 부제, 설명, 슬러그, 태그, `content` 블록 배열)
- 프롬프트: `prompts/writer.ts`

### 2.5 4/5 검수 (Editor)

- **모델:** `quality` (Claude Sonnet)
- 입력: 작성 초안 JSON
- 출력: 다듬어진 `ArticleDraft` JSON
- 프롬프트: `prompts/editor.ts`

### 2.6 글 저장 → 이미지 → 갱신

1. 최종 초안을 `ContentBlock[]`로 변환한 뒤 **`createArticle()`**으로 먼저 저장합니다.  
   - 이때 **글 ID**가 DB에서 발급됩니다.
2. **5/5 이미지:** `generateArticleImage()`에서 파일 베이스 이름으로 **`article.id`**를 넘깁니다 (`slug` 파라미터에 ID 사용).  
   - 결과 경로: **`/public/img/{글ID}.webp`** (중간은 `images/`에 임시 저장 후 `yarn webp`로 변환)
3. 본문 앞쪽(첫 `h2` 앞, 없으면 앞쪽 몇 블록 뒤)에 **이미지 블록**을 끼워 넣고, **`updateArticle(article.id, { imageUrl, content })`**로 반영합니다.
4. 이미지 단계만 실패해도 글은 이미 저장된 상태이므로, **이미지 없이 발행**되며 콘솔에 경고만 남습니다.

### 2.7 주제 소진

- 성공 시 `markTopicUsed(topic.id)`로 해당 주제의 **`used`를 `true`**로 바꾸고 `.pipeline-topics.json`에 다시 씁니다.

---

## 3. 관련 파일·데이터

| 경로 | 역할 |
|------|------|
| `.pipeline-topics.json` | 주제 풀 (`id`, `keyword`, `description`, `category`, `used`) |
| `.mock-db.json` | 글 DB (로컬/서버에서 파이프라인이 쓰는 저장소) |
| `images/` | 이미지 생성 직후 원본(png/jpg) 임시 저장 후 삭제 |
| `public/img/{articleId}.webp` | 최종 서빙 이미지 (파일명 = **글 ID**) |
| `src/app/api/cron/generate-article/route.ts` | HTTP 진입점 (POST + 인증) |
| `src/lib/pipeline/pipeline.ts` | 오케스트레이션 |
| `src/lib/pipeline/llm.ts` | OpenRouter 클라이언트·모델 매핑 |
| `src/lib/pipeline/image.ts` | Google GenAI 이미지 생성·webp 변환 |
| `src/lib/pipeline/topics.ts` | 주제 로드/선택/used 처리 |
| `src/lib/pipeline/prompts/*.ts` | 단계별 시스템·유저 프롬프트 |

---

## 4. 환경 변수

| 변수 | 용도 |
|------|------|
| `OPENROUTER_API_KEY` | 텍스트 단계(기획·리서치·작성·검수) OpenRouter 호출 |
| `GOGGLE_API_KEY` | Google GenAI 이미지 생성 (`@google/genai`) |
| `CRON_SECRET` | Cron API `Authorization: Bearer ...`와 일치해야 호출 허용 |
| `NEXT_PUBLIC_SITE_URL` | (선택) OpenRouter `HTTP-Referer` 기본값 보조 |

OpenRouter 클라이언트는 HTTP 헤더에 **ASCII만** 사용합니다 (`X-Title`: `stock-diary`).

---

## 5. 실행 방법

### 5.1 프로덕션 / 배포 서버 (cron)

1. 서버에 위 환경 변수가 설정되어 있어야 합니다.
2. **POST** 요청:

```http
POST /api/cron/generate-article
Authorization: Bearer <CRON_SECRET과 동일>
Content-Type: application/json
```

3. Next.js 라우트 설정에 따라 **도메인 + HTTPS** 기준 전체 URL 예:

```bash
curl -sS -X POST "https://<your-domain>/api/cron/generate-article" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json"
```

4. `route.ts`에서 `maxDuration = 120`(초)으로 두어, Vercel 등 제한이 있는 환경에서는 플랫폼 한도와 맞춰 조정이 필요할 수 있습니다.

### 5.2 로컬 개발

1. `.env.local`에 동일 키 설정
2. `npm run dev` / `yarn dev` 후 포트에 맞춰 호출 (예: `localhost:3000`)

```bash
curl -sS -X POST "http://localhost:3000/api/cron/generate-article" \
  -H "Authorization: Bearer <CRON_SECRET>" \
  -H "Content-Type: application/json"
```

성공 시 JSON에 `articleId`, `title`, `slug`, `topic`, 각 단계별 `steps`(소요 시간) 등이 포함됩니다.

---

## 6. 사이트맵·목록 UI

- `src/app/sitemap.ts`는 **`dynamic = "force-dynamic"`** 이라 요청 시점에 `getArticles({ status: "published" })`로 URL 목록을 만듭니다.
- 새 글이 DB에 `published`로 들어가면 **별도 “사이트맵 발행” 작업 없이** 다음 `/sitemap.xml` 요청에 반영됩니다.

---

## 7. 운영 시 유의사항

1. **상태 파일 동시성**  
   같은 서버에서 cron이 겹치면 `.pipeline-topics.json` / `.mock-db.json` 쓰기가 경합할 수 있습니다. **하루 1회·한 인스턴스만 실행**하거나, 필요하면 락/큐를 두는 것이 안전합니다.

2. **블루그린·다중 인스턴스**  
   DB가 파일 기반이면 **인스턴스마다 파일이 다를 수 있습니다.** 자동 발행 글이 모든 노드에서 보이게 하려면, 추후 공유 스토리지나 DB로 옮기는 것을 검토해야 합니다.

3. **주제 고갈**  
   `used: false`인 주제가 없으면 파이프라인은 즉시 실패합니다. `.pipeline-topics.json`에 주제를 추가하거나 `used`를 필요 시 초기화합니다.

4. **비밀 관리**  
   `CRON_SECRET`은 저장소에 커밋하지 말고, 서버 환경 변수만 사용합니다.

---

## 8. 수동 실행·테스트 (개발자 참고)

파이프라인 로직은 `runPipeline()`으로 묶여 있으므로, 필요 시 다른 API나 스크립트에서 동일 함수를 import해 호출할 수 있습니다. 다만 프로덕션에서는 **cron + 단일 HTTP 엔드포인트**가 운영하기 가장 단순합니다.

---

*문서 버전: 코드 기준으로 정리되었으며, 모델명·환경 변수는 `llm.ts`, `image.ts`, `route.ts` 변경 시 함께 갱신하는 것을 권장합니다.*
