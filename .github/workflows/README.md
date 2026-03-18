# GitHub Actions - 블루-그린 배포

## 동작 방식

`main` 브랜치에 push 시 자동으로:

1. **SSH로 서버 접속** → `168.107.21.118` (또는 설정한 호스트)
2. **소스 최신화** → `cd jusik && git fetch && git reset --hard origin/main`
3. **deploy.sh 실행** → Docker 빌드 → 블루/그린 전환 → Nginx reload

## 필요한 GitHub Secrets

| Secret | 설명 |
|--------|------|
| `SERVER_HOST` | 서버 IP 또는 도메인 (예: `168.107.21.118`) |
| `SERVER_USER` | SSH 사용자 (예: `ubuntu`) |
| `SSH_PRIVATE_KEY` | 서버 접속용 SSH 개인키 전체 내용 |

### SSH 키 생성 및 등록

```bash
# 로컬에서 키 생성 (이미 있으면 생략)
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/jusik_deploy -N ""

# 서버에 공개키 등록
ssh-copy-id -i ~/.ssh/jusik_deploy.pub ubuntu@168.107.21.118
```

GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**에서 위 3개 추가.
