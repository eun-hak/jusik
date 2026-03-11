# 관리자 시스템 구현 변경사항

> 작성일: 2026-03-11  
> SQL 없이 목업 데이터로 구현된 관리자 페이지 및 관련 인프라 변경사항을 정리합니다.

---

## 1. 개요

- **목적**: 글을 관리할 수 있는 관리자 페이지 구축
- **현재 상태**: SQL 없이 인메모리 목업 DB 사용 (추후 DB 연동 시 `src/lib/db/articles.ts`만 교체)
- **인증**: 세션 쿠키 기반 (Web Crypto API HMAC 서명)

---

## 2. 새로 생성된 파일

### 2.1 데이터 레이어 (`src/lib/db/`)

| 파일 | 설명 |
|------|------|
| `types.ts` | `Article`, `ContentBlock`, `ArticleInput`, `ArticleUpdate` 타입 정의 |
| `mock.ts` | 인메모리 Map 기반 목업 DB. `globalThis.__articlesDb`로 HMR 시 데이터 유지 |
| `articles.ts` | `getArticles`, `getArticleById`, `getArticleBySlug`, `createArticle`, `updateArticle`, `deleteArticle`, `getStats` 함수 |

**Article 구조:**
```ts
{
  id, slug, title, subtitle, description, category, date,
  publishedTime, readTime, author, imageUrl,
  content: ContentBlock[],  // { id, type: "h2"|"h3"|"p"|"quote", text }
  tags: string[],
  status: "draft" | "published",
  createdAt, updatedAt
}
```

### 2.2 인증 레이어

| 파일 | 설명 |
|------|------|
| `src/lib/auth.ts` | `createSessionToken()`, `verifySessionToken()`, `SESSION_COOKIE` 상수 |
| `src/middleware.ts` | `/admin/*` (login 제외) 경로 인증 체크, 미인증 시 `/admin/login` 리다이렉트 |

### 2.3 API 라우트 (`src/app/api/admin/`)

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/api/admin/auth` | POST | 로그인 (email, password) → 세션 쿠키 설정 |
| `/api/admin/auth` | DELETE | 로그아웃 (세션 쿠키 삭제) |
| `/api/admin/articles` | GET | 글 목록 조회 |
| `/api/admin/articles` | POST | 새 글 생성 |
| `/api/admin/articles/[id]` | GET | 단일 글 조회 |
| `/api/admin/articles/[id]` | PATCH | 글 수정 |
| `/api/admin/articles/[id]` | DELETE | 글 삭제 |

### 2.4 관리자 페이지 (`src/app/admin/`)

| 경로 | 설명 |
|------|------|
| `layout.tsx` | AdminSidebar + 메인 콘텐츠 영역 |
| `page.tsx` | 대시보드 (통계 카드, 최근 글, 빠른 액션) |
| `login/page.tsx` | 로그인 폼 (이메일/비밀번호) |
| `articles/page.tsx` | 글 목록 테이블 |
| `articles/new/page.tsx` | 새 글 작성 |
| `articles/[id]/edit/page.tsx` | 기존 글 수정 |

### 2.5 컴포넌트

| 파일 | 설명 |
|------|------|
| `src/components/ConditionalLayout.tsx` | `pathname`이 `/admin`이면 Header/Footer 없이 children만 렌더 |
| `src/components/admin/AdminSidebar.tsx` | 관리자 사이드바 (대시보드, 글 관리, 새 글 쓰기, 사이트 보기, 로그아웃) |
| `src/components/admin/ArticleForm.tsx` | 블록 에디터 + 메타데이터 폼 (제목, 부제목, 본문 블록, 슬러그, 카테고리, 날짜, 태그 등) |
| `src/components/admin/ArticleTable.tsx` | 글 목록 테이블 (수정/삭제/보기 링크) |

### 2.6 환경 변수 예시

| 파일 | 설명 |
|------|------|
| `.env.example` | `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET` 등 예시 값 |

---

## 3. 수정된 기존 파일

### 3.1 `src/app/layout.tsx`

**변경 전:**
```tsx
<Header />
<main id="main-content" className="...">{children}</main>
<Footer />
<MobileBottomNav />
```

**변경 후:**
```tsx
<ConditionalLayout>{children}</ConditionalLayout>
```

- `ConditionalLayout`이 `/admin` 경로일 때 Header/Footer/MobileBottomNav를 숨김

### 3.2 `src/app/page.tsx`

**변경 사항:**
- 하드코딩된 `latestArticles` 제거
- `getArticles({ status: "published" })`로 발행된 글만 조회
- `latestArticles.length === 0`일 때 빈 상태 메시지 표시

### 3.3 `src/app/article/[slug]/page.tsx`

**변경 사항:**
- 하드코딩된 `articles` 객체 제거
- `getArticleBySlug(slug)`로 DB에서 글 조회
- `relatedArticles`를 `getArticles({ status: "published" })`에서 생성
- `content` 블록에 `block.id` 사용 (기존 `key={i}` → `key={block.id}`)
- `export const dynamic = "force-dynamic"` 추가 (목업 DB 사용으로 정적 생성 비활성화)

---

## 4. 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `ADMIN_EMAIL` | `admin@example.com` | 관리자 로그인 이메일 |
| `ADMIN_PASSWORD` | `password` | 관리자 비밀번호 |
| `ADMIN_SECRET` | `dev-secret-change-in-production` | 세션 토큰 HMAC 서명용 비밀키 |

---

## 5. 사용 방법

### 5.1 로그인
1. `http://localhost:3003/admin/login` 접속
2. `admin@example.com` / `password` 입력 (또는 `.env`에 설정한 값)

### 5.2 글 작성
1. `/admin/articles/new` 이동
2. 제목 입력 → 슬러그 자동 생성 (수동 수정 가능)
3. 본문 블록 추가 (문단, H2, H3, 인용구)
4. 메타데이터 입력 (카테고리, 날짜, 태그 등)
5. "초안 저장" 또는 "발행" 클릭

### 5.3 글 수정/삭제
- `/admin/articles`에서 수정/삭제 버튼 사용

---

## 6. 추후 SQL 연동 시 작업

1. **`src/lib/db/articles.ts`**  
   - `getArticles`, `getArticleById`, `getArticleBySlug`, `createArticle`, `updateArticle`, `deleteArticle`, `getStats` 함수를 실제 DB 쿼리로 교체

2. **스키마 참고** (이전 설계 문서 기준)
   - `users` (관리자)
   - `articles` (글 메타)
   - `article_content` (본문 블록)
   - `tags`, `article_tags` (태그)

3. **타입**  
   - `src/lib/db/types.ts`는 그대로 사용 가능

---

## 7. 파일 구조 요약

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   └── articles/
│   │       ├── page.tsx
│   │       ├── new/page.tsx
│   │       └── [id]/edit/page.tsx
│   ├── api/admin/
│   │   ├── auth/route.ts
│   │   └── articles/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── article/[slug]/page.tsx  (수정)
│   ├── layout.tsx               (수정)
│   └── page.tsx                 (수정)
├── components/
│   ├── ConditionalLayout.tsx    (신규)
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── ArticleForm.tsx
│       └── ArticleTable.tsx
├── lib/
│   ├── auth.ts
│   └── db/
│       ├── types.ts
│       ├── mock.ts
│       └── articles.ts
├── middleware.ts
└── ...
```
