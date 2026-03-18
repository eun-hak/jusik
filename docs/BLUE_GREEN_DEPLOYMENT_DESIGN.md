# jusik 블루-그린 배포 설계

> 도메인 적용 직전 단계. Docker + Nginx 기반 무중단 배포 구조.

---

## 1. 아키텍처 개요

```
                    [외부 요청]
                         │
                         ▼
                   [Nginx :80/:443]
                         │
                    proxy_pass
                         │
              ┌──────────┴──────────┐
              │  upstream jusik     │
              │  server 127.0.0.1   │
              │  :ACTIVE_PORT       │  ← 배포 시 포트만 전환
              └──────────┬──────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
   [jusik-green :3000]             [jusik-blue :3001]
   Docker container                Docker container
   (현재 서비스 중)                  (배포 대기 / 새 버전)
```

### 흐름
1. **초기**: 그린(3000)만 실행, Nginx → 3000
2. **배포**: 블루(3001)에 새 이미지 실행 → 헬스체크 → Nginx를 3001로 전환 → 그린 중지
3. **다음 배포**: 역할 교대 (블루→그린, 그린→블루)

---

## 2. 디렉터리 구조

```
/home/ubuntu/
├── jusik/                    # 소스코드
│   ├── Dockerfile
│   ├── .env.production       # 프로덕션 env (git 제외)
│   └── ...
│
├── deploy/                   # 배포 관련 (신규 생성)
│   ├── docker-compose.yml    # 그린/블루 컨테이너 정의
│   ├── nginx/
│   │   ├── nginx.conf        # 메인 설정
│   │   └── conf.d/
│   │       └── jusik.conf    # upstream + proxy 설정
│   ├── scripts/
│   │   ├── deploy.sh        # 배포 실행 스크립트
│   │   └── switch.sh        # 그린↔블루 전환만
│   └── .env                  # ACTIVE_PORT 등 (또는 deploy 시 인자로)
│
└── iptables-ports.md
```

---

## 3. 포트 할당

| 구분 | 포트 | 용도 |
|------|------|------|
| 그린 | 3000 | 현재 서비스 중인 인스턴스 |
| 블루 | 3001 | 새로 배포된 인스턴스 (전환 대기) |
| Nginx | 80, 443 | 외부 접근 (도메인 적용 시) |

---

## 4. 구성 요소 상세

### 4.1 Dockerfile (jusik 프로젝트 루트)

```dockerfile
# Multi-stage: 빌드 → 실행
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**주의**: Next.js standalone 출력 필요 → `next.config.ts`에 `output: 'standalone'` 추가

---

### 4.2 docker-compose.yml

```yaml
services:
  jusik-green:
    image: jusik:latest
    container_name: jusik-green
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file: ../jusik/.env.production
    profiles:
      - green   # 필요 시 프로파일로 제어

  jusik-blue:
    image: jusik:latest
    container_name: jusik-blue
    restart: unless-stopped
    ports:
      - "3001:3000"   # 호스트 3001 → 컨테이너 3000
    env_file: ../jusik/.env.production
    profiles:
      - blue
```

- 한 번에 하나만 실행 (그린 또는 블루)
- `profiles`로 선택적 기동 가능

---

### 4.3 Nginx 설정 (핵심)

**upstream + 동적 포트 전환 방식**

```nginx
# deploy/nginx/conf.d/jusik.conf
upstream jusik_backend {
    server 127.0.0.1:3000;   # 또는 3001 — 배포 스크립트가 이 줄만 수정
}

server {
    listen 80;
    server_name _;   # 도메인 적용 시 jusikilgi.com 등으로 변경
    location / {
        proxy_pass http://jusik_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**전환 방법**: `server 127.0.0.1:3000` → `3001`로 sed 치환 후 `nginx -s reload`

---

### 4.4 배포 스크립트 (deploy.sh) 로직

```
1. cd jusik && docker build -t jusik:latest .
2. 현재 ACTIVE_PORT 확인 (3000 or 3001)
3. INACTIVE_PORT = 반대 (3001 or 3000)
4. docker run jusik:latest -p INACTIVE_PORT:3000 (블루/그린 중 비활성 쪽)
5. curl http://127.0.0.1:INACTIVE_PORT (헬스체크, 최대 N회 재시도)
6. Nginx conf에서 upstream을 INACTIVE_PORT로 변경
7. nginx -s reload
8. 기존 활성 컨테이너 중지
9. ACTIVE_PORT 상태 파일 업데이트 (다음 배포용)
```

---

## 5. 헬스체크

- **엔드포인트**: `GET /` 또는 `GET /api/health` (필요 시 추가)
- **조건**: HTTP 200 응답
- **타임아웃**: 5~10초, 3~5회 재시도

---

## 6. 환경 변수

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (도메인 적용 후 변경) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | 관리자 로그인 |
| `ADMIN_SECRET` | 세션 시크릿 |
| `OPENAI_API_KEY` | API 키 |

`.env.production`을 `jusik/` 루트에 두고, Docker `env_file`로 주입.

---

## 7. 구현 순서

| 순서 | 작업 | 산출물 |
|------|------|--------|
| 1 | next.config에 `output: 'standalone'` 추가 | next.config.ts |
| 2 | Dockerfile 작성 | jusik/Dockerfile |
| 3 | deploy 디렉터리 및 docker-compose 생성 | deploy/ |
| 4 | Nginx 설정 작성 | deploy/nginx/ |
| 5 | deploy.sh 스크립트 작성 | deploy/scripts/ |
| 6 | .env.production 예시 및 상태 파일 | deploy/.active-port 등 |
| 7 | 로컬/서버에서 수동 배포 테스트 | - |

---

## 8. 도메인 적용 시 (이후 단계)

- Nginx `server_name`에 도메인 추가
- Certbot으로 SSL 발급
- `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 변경

---

## 9. CI/CD 연동 (선택)

- GitHub Actions에서 `main` push 시:
  1. SSH로 서버 접속
  2. `git pull` + `./deploy/scripts/deploy.sh` 실행
- Secrets: `SSH_PRIVATE_KEY`, `SERVER_HOST`, `SERVER_USER`
