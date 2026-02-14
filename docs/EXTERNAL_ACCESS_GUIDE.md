# 외부(Vercel) -> 로컬 API 연결 가이드

## 목표

- 프론트엔드(Vercel): `https://growit-pipeline.vercel.app`
- 로컬 백엔드: `http://localhost:3000`
- 목표: Vercel에서 발생한 이벤트를 로컬 API로 전달하여 `data/bronze`에 적재

## 1) 프론트엔드 환경 변수 설정

UI 프로젝트 루트(`daily-spark-learn-main/daily-spark-learn-main`)에서 아래 값을 사용합니다.

```
VITE_API_URL=https://<public-api-domain>
```

예시

```
VITE_API_URL=https://abc123.ngrok-free.app
```

Vercel 설정

- Vercel Project -> Settings -> Environment Variables
- Key: `VITE_API_URL`
- Value: 터널 공개 URL (`https://...`)
- 환경(Production/Preview/Development) 선택 후 재배포

로컬 개발용 파일 예시

```
daily-spark-learn-main/daily-spark-learn-main/.env.local
```

```
VITE_API_URL=https://abc123.ngrok-free.app
```

## 2) 백엔드 CORS 설정

루트 `.env`에 Vercel 도메인과 로컬 개발 도메인을 함께 등록합니다.

```
CORS_ORIGINS=https://growit-pipeline.vercel.app,http://localhost:3000,http://127.0.0.1:3000
```

터널 도메인 자체는 브라우저 Origin이 아니므로 일반적으로 `CORS_ORIGINS`에 넣지 않습니다.
브라우저 Origin은 Vercel 도메인입니다.

설정 반영

```bash
cd /mnt/c/Users/USER/growit-pipeline
docker compose restart web
```

## 3) ngrok 방식

사전조건

- 로컬에서 API가 `http://localhost:3000`으로 정상 동작
- ngrok 설치 및 로그인 완료 (`ngrok config add-authtoken <TOKEN>`)

실행

```bash
ngrok http 3000
```

출력된 `https://xxxx.ngrok-free.app`를 `VITE_API_URL`에 설정합니다.

점검

```bash
curl -i https://xxxx.ngrok-free.app/api/health
```

## 4) Cloudflare Tunnel 방식

사전조건

- Cloudflare 계정, 도메인 보유
- `cloudflared` 설치

빠른 테스트(임시 도메인)

```bash
cloudflared tunnel --url http://localhost:3000
```

고정 도메인 운영(권장)

```bash
cloudflared tunnel login
cloudflared tunnel create growit-api
cloudflared tunnel route dns growit-api api.your-domain.com
```

`~/.cloudflared/config.yml` 예시

```yaml
tunnel: growit-api
credentials-file: /home/<user>/.cloudflared/<tunnel-id>.json
ingress:
  - hostname: api.your-domain.com
    service: http://localhost:3000
  - service: http_status:404
```

실행

```bash
cloudflared tunnel run growit-api
```

그 후 프론트엔드에:

```
VITE_API_URL=https://api.your-domain.com
```

## 5) 전체 동작 확인

1. 로컬 스택 실행

```bash
cd /mnt/c/Users/USER/growit-pipeline
docker compose up -d
```

2. 터널 실행(ngrok 또는 cloudflared)
3. Vercel에서 `VITE_API_URL` 업데이트 후 재배포
4. 배포 사이트 접속 후 버튼 클릭/페이지 이동
5. 로컬 적재 확인

```bash
cd /mnt/c/Users/USER/growit-pipeline
find data/bronze/app -name "part-*.jsonl" -type f | tail -n 5
```

최근 파일 확인

```bash
tail -n 20 data/bronze/app/$(date +%Y/%m/%d)/part-$(date +%Y%m%d-%H).jsonl
```
