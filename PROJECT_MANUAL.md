# Growit Pipeline Manual

## Overview
FastAPI (event collection) -> Airflow (orchestration) -> Spark + Delta Lake (ETL) -> Delta Lake storage at `./data/delta/events`.

## Prerequisites
- Docker Desktop
- Docker Compose v2

## Setup
1) Copy env file
```
cp .env.example .env
```

2) Create host folders (needed for volume mounts)
- Linux/macOS
```
mkdir -p data/bronze/app data/delta/events data/spark-events tmp airflow/logs
```
- Windows PowerShell
```
New-Item -ItemType Directory -Force -Path data\bronze\app, data\delta\events, data\spark-events, tmp, airflow\logs
```

3) Fix permissions (most important)
- Linux/macOS
```
mkdir -p data tmp airflow/logs
sudo chown -R $USER:$USER data tmp airflow/logs
chmod -R 775 data tmp airflow/logs
```
- Windows PowerShell (Run as Admin)
```
icacls growit-pipeline\data growit-pipeline\tmp growit-pipeline\airflow\logs /grant "Users:(OI)(CI)F" /t
```

## Start
```
docker-compose up -d --build
```

## Endpoints
- FastAPI health: `http://localhost:3000/api/health`
- Airflow UI: `http://localhost:8082`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`
- Spark Master UI: `http://localhost:18080`
- Spark History UI: `http://localhost:18081`

## Verification
1) Healthcheck
```
curl -s http://localhost:3000/api/health
```

2) Send 10 sample events
```
for i in $(seq 1 10); do 
  curl -s -X POST http://localhost:3000/api/events \
    -H 'Content-Type: application/json' \
    -d '{"event_type":"click","anonymous_id":"anon-'"$i"'","user_id":null,"metadata":{"idx":'"$i"'}}' >/dev/null;
done
```

3) Confirm bronze JSONL exists
```
ls data/bronze/app/$(date +%Y/%m/%d)/part-$(date +%Y%m%d-%H).jsonl
```

4) (Optional) MinIO 업로드 확인
```
docker-compose exec minio mc ls local/logs/bronze/app/$(date +%Y/%m/%d)/
```

5) Trigger Airflow DAG
- Open Airflow UI -> DAGs -> `growit_etl` -> Trigger DAG

6) Confirm Delta Lake outputs
```
ls data/delta/events/_delta_log
ls data/delta/events/event_date=
```

## Troubleshooting
- If the web container cannot write to `./data`, re-run the permissions section.
- If Spark packages fail to download, ensure `./tmp` is writable; the ivy cache is mounted there.
- If MinIO is disabled, keep `USE_MINIO=false` (default). The upload logic is skipped.

## Environment toggles
- `AUTH_MODE=off` (Supabase 연동은 이번 스코프에서 구현하지 않음)
- `USE_MINIO=true|false`
- Supabase 자리표시용 ENV: `SUPABASE_JWT_SECRET`, `SUPABASE_ISSUER`, `SUPABASE_AUD`

## UI 폴더 변경 금지 체크
- 이 프로젝트는 `daily-spark-learn-main/`을 수정하면 안 됩니다.
- Git이 있는 경우 아래로 변경 여부를 확인하세요.
```
git status --porcelain
```

---

## 배포 가이드 (Vercel + 외부 서버)

이 가이드는 UI는 Vercel에, 백엔드 데이터 파이프라인은 외부 클라우드 서버(VM)에 배포하는 하이브리드 아키텍처를 기준으로 설명합니다.

### 1부: 백엔드 파이프라인 서버 배포

#### 1.1. 클라우드 서버 준비
- AWS EC2, Google Cloud VM, DigitalOcean Droplet 등 원하는 클라우드 서비스에서 서버(VM) 인스턴스를 생성합니다. (Ubuntu 22.04 LTS 권장)
- 서버에 **고정 공인 IP 주소**를 할당합니다. 이 IP 주소는 이후 UI에서 API를 호출할 주소가 됩니다.

#### 1.2. 서버 접속 및 사전 준비
- SSH를 사용하여 서버에 접속합니다.
- 서버에 `git`, `docker`, `docker-compose`를 설치합니다. (설치 방법은 각 클라우드 제공업체의 문서를 참고하세요.)

#### 1.3. 방화벽 설정
- 클라우드 제공업체의 방화벽 설정(예: AWS 보안 그룹)에서 다음 포트에 대한 인바운드 트래픽을 허용합니다.
  - `22/TCP` (SSH 접속용)
  - `3000/TCP` (FastAPI 접속용, `.env` 파일의 `WEB_PORT`와 일치해야 함)

#### 1.4. 프로젝트 클론 및 실행
- Git 저장소를 서버에 클론합니다.
  ```bash
  git clone <YOUR_GIT_REPOSITORY_URL>
  cd growit-pipeline
  ```
- `.env.example` 파일을 복사하여 `.env` 파일을 생성하고, 필요한 환경 변수를 설정합니다. **특히 `CORS_ORIGINS`는 나중에 Vercel 배포 후 채워야 하므로 일단 비워두거나 로컬 테스트용 주소만 남겨둡니다.**
  ```bash
  cp .env.example .env
  ```
- Docker Compose로 전체 스택을 실행합니다.
  ```bash
  docker compose up -d --build
  ```

### 2부: Vercel UI 배포

#### 2.1. UI 코드에 API 호출 로직 추가
- 현재 UI(`daily-spark-learn-main`)에는 백엔드 API를 호출하는 코드가 없습니다. 이 로직을 추가해야 합니다.
- 예를 들어, `daily-spark-learn-main/src/lib/api.ts`와 같은 파일을 새로 만들고 아래 내용을 추가합니다.

  ```typescript
  // daily-spark-learn-main/src/lib/api.ts

  // 1부에서 준비한 백엔드 서버의 공인 IP 주소를 입력합니다.
  const API_URL = 'http://<YOUR_SERVER_PUBLIC_IP>:3000';

  export interface EventData {
    event_type: string;
    user_id?: string | null;
    anonymous_id?: string | null;
    metadata?: object;
  }

  export const sendEvent = async (eventData: EventData) => {
    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to send event: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error sending event:', error);
      return null;
    }
  };
  ```
- 이제 UI 컴포넌트 내에서 이벤트가 발생할 때마다 위 `sendEvent` 함수를 호출합니다. 예를 들어, 버튼 클릭 시 이벤트를 전송할 수 있습니다.
  ```tsx
  // 예시: src/components/SomeButton.tsx
  import { sendEvent } from '@/lib/api';

  const handleButtonClick = () => {
    sendEvent({
      event_type: 'button_click',
      anonymous_id: 'some-anonymous-user-id',
      metadata: { button_name: 'hero_button' }
    });
    // ... 기존 버튼 클릭 로직
  };
  ```

#### 2.2. Vercel 배포
- Vercel에 로그인하여 새 프로젝트를 생성하고, 당신의 Git 저장소를 연결합니다.
- Vercel이 `daily-spark-learn-main` 디렉토리를 루트로 인식하도록 설정합니다.
- 프레임워크 프리셋으로 `Vite`를 선택하면 대부분의 빌드 설정(빌드 명령어: `npm run build`, 출력 디렉토리: `dist`)이 자동으로 구성됩니다.
- **환경 변수는 설정할 필요가 없습니다.** (API 주소는 코드에 직접 명시했으므로)
- 배포를 진행합니다. 배포가 완료되면 `my-app.vercel.app`과 같은 고유한 Vercel 도메인을 얻게 됩니다.

### 3부: 최종 연결

#### 3.1. 백엔드 CORS 설정 업데이트
- 다시 SSH로 백엔드 서버에 접속합니다.
- `growit-pipeline` 디렉토리의 `.env` 파일을 엽니다.
- `CORS_ORIGINS` 변수에 **2.2 단계에서 얻은 Vercel 도메인**을 추가합니다. 여러 개일 경우 쉼표(`,`)로 구분합니다.
  ```
  # .env
  CORS_ORIGINS=https://my-app.vercel.app,http://localhost:8080
  ```
- 수정된 `.env` 파일을 저장하고, FastAPI 컨테이너를 재시작하여 설정을 적용합니다.
  ```bash
  docker compose restart web
  ```

이제 Vercel에 배포된 UI에서 발생하는 모든 이벤트가 당신의 백엔드 서버로 전송되고, 데이터 파이프라인을 통해 최종적으로 MinIO와 Delta Lake에 적재됩니다.
