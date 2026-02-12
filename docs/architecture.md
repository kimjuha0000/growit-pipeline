# GrowIt Architecture & Current Development Status

- Updated at: 2026-02-13 01:27:59 KST
- Repository root: `/mnt/c/Users/USER/growit-pipeline`
- Active branch: `main`
- Current HEAD: `dff6d41` (`로그인 구현1`)

## 1. Overview

This repository currently has two major domains:

1. Learning Web App (React/Vite):
- Path: `daily-spark-learn-main/daily-spark-learn-main`
- Responsibilities: user-facing learning UX, authentication UI, header-level study status display, analytics event emission.

2. Data Platform (FastAPI + Airflow + Spark + MinIO/Delta):
- Responsibilities: ingest frontend events, store Bronze data, run ETL, persist Delta tables.

A lightweight root-level Node workspace also exists (`/src`, `/package.json`) but the active production frontend code is under `daily-spark-learn-main/daily-spark-learn-main`.

## 2. High-Level Architecture

```mermaid
flowchart LR
  U[User Browser]

  subgraph FE[React App (Vite)]
    APP[App Router\n/ /curriculum /learn /auth]
    HDR[Header\nLogin/Logout + Today Stats]
    AUTH[Auth Page\nEmail OTP via Supabase]
    LOG[logger.ts\nUI/Page Event Tracking]
  end

  subgraph SB[Supabase]
    SBA[Auth]
    SBT[(user_stats)]
  end

  subgraph API[FastAPI]
    WEB[/POST /api/events/]
  end

  subgraph STORAGE[Storage]
    BR[(Bronze JSONL\n/data/bronze/app/...)]
    MI[(MinIO bucket: logs\noptional)]
    DL[(Delta Lake\n/data/delta/events)]
  end

  subgraph ORCH[Airflow + Spark]
    AF[Airflow DAG\ngrowit_etl]
    SP[Spark ETL job_etl.py]
  end

  U --> APP
  APP --> HDR
  APP --> AUTH
  APP --> LOG

  AUTH --> SBA
  HDR --> SBA
  HDR --> SBT

  LOG --> WEB
  WEB --> BR
  WEB -. USE_MINIO=true .-> MI

  AF --> SP
  SP -->|read| BR
  SP -->|write| DL
```

## 3. Runtime Components (docker-compose)

| Component | Path/Image | Role | Ports |
|---|---|---|---|
| `web` | `./web` | FastAPI ingest API (`/api/events`, `/api/health`) | `${WEB_PORT}:3000` |
| `minio` | `minio/minio` | Object storage backend | `${MINIO_API_PORT}:9000`, `${MINIO_CONSOLE_PORT}:9001` |
| `minio-init` | `minio/mc` | Bootstrap `logs` bucket | none |
| `spark-master` | `apache/spark:3.4.1` | Spark cluster master | `7077`, `${SPARK_UI_PORT}:8080` |
| `spark-worker` | `apache/spark:3.4.1` | Spark worker | internal |
| `spark-history` | `apache/spark:3.4.1` | Spark history UI | `${SPARK_HISTORY_PORT}:18081` |
| `airflow` | `./airflow` | Scheduler + webserver + spark-submit orchestration | `${AIRFLOW_PORT}:8080` |
| `init-perms` | `alpine:3.18` | Creates and chmods data/log dirs | none |

Source: `docker-compose.yml`

## 4. Frontend Architecture (Current)

### 4.1 App entry and providers

File: `daily-spark-learn-main/daily-spark-learn-main/src/App.tsx`

- `QueryClientProvider`, `LanguageProvider`, `AuthProvider` are mounted globally.
- Session is tracked with:
  - `supabase.auth.getSession()`
  - `supabase.auth.onAuthStateChange(...)`
- Global trackers:
  - route view tracking (`page_view`)
  - DOM event tracking (`ui_click`, `ui_change`, `ui_submit`)

### 4.2 Routing

- `/` -> `Index`
- `/curriculum` -> `Curriculum`
- `/learn/:curriculumId/:day` -> `Learn`
- `/auth` -> `Auth` (from `src/components/Auth.tsx`, currently re-exporting `src/pages/Auth.tsx`)
- `*` -> `NotFound`

### 4.3 Authentication model

Files:
- `daily-spark-learn-main/daily-spark-learn-main/src/lib/supabaseClient.ts`
- `daily-spark-learn-main/daily-spark-learn-main/src/pages/Auth.tsx`
- `daily-spark-learn-main/daily-spark-learn-main/src/components/Auth.tsx`

- `supabaseClient` uses `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Auth page currently submits `supabase.auth.signInWithOtp({ email })`.
- UI still includes legacy password field and signup toggle, but backend action is OTP-only.

### 4.4 Header status and user controls

File: `daily-spark-learn-main/daily-spark-learn-main/src/components/Header.tsx`

- If `session` exists:
  - show `로그아웃` button (`supabase.auth.signOut()`)
  - show compact today stats block:
    - `daily_study_minutes`
    - `current_streak`
- Stats query:
  - table: `user_stats`
  - condition: `.eq("user_id", session.user.id)`
  - if `last_study_date != today` => minutes shown as `0`.

### 4.5 Analytics emission

File: `daily-spark-learn-main/daily-spark-learn-main/src/lib/logger.ts`

- Sends `POST ${VITE_API_URL}/api/events`
- Payload fields:
  - `event_type`
  - `anonymous_id`
  - `metadata`

## 5. Backend & Data Pipeline

### 5.1 FastAPI ingest API

File: `web/app.py`

- Endpoints:
  - `GET /api/health`
  - `POST /api/events`
- Writes JSONL to:
  - `/data/bronze/app/YYYY/MM/DD/part-YYYYMMDD-HH.jsonl`
- When `USE_MINIO=true`:
  - uploads same data to MinIO bucket (`logs`) using boto3 S3 API.
- Current auth mode in backend:
  - `AUTH_MODE=off` path only (enforced in `_validate_auth`).

### 5.2 Airflow DAG

File: `airflow/dags/growit_etl.py`

- DAG: `growit_etl`
- Schedule: hourly (`0 * * * *`)
- Flow:
  1. `check_bronze` (ShortCircuit): checks if date partition has `part-*.jsonl`
  2. `spark_etl` (SparkSubmitOperator): runs Spark job only when input exists.

### 5.3 Spark ETL

File: `spark/app/job_etl.py`

- Reads Bronze JSON.
- Normalizes to stable columns:
  - `anonymous_id`, `event_id`, `event_type`, `received_at`, `user_id`, `event_version`, `metadata_json`, `event_date`
- Handles legacy `metadata` by converting struct to JSON.
- Deduplicates by `event_id`.
- Writes Delta append mode partitioned by `event_date` with `mergeSchema=true`.

## 6. Environment Snapshot (Code-Level)

### Root `.env` (`/mnt/c/Users/USER/growit-pipeline/.env`)

- Backend toggles:
  - `AUTH_MODE=off`
  - `USE_MINIO=false`
- Frontend-to-backend endpoint:
  - `VITE_API_URL` is configured.
- Supabase placeholders are present in root `.env` (not used by Vite runtime directly for nested frontend unless injected via that app context).

### Frontend `.env` (`daily-spark-learn-main/daily-spark-learn-main/.env`)

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` are populated.
- This is the effective source for Supabase client in current frontend app path.

## 7. Current Development Status Summary

### Completed

- Supabase package/client integration in active frontend app.
- Email OTP login action wired to Supabase.
- App-wide session tracking with auth context provider.
- Login gate removed from entry route: non-logged users can still use app.
- Header-based login/logout UX implemented.
- Header-based `오늘 학습` compact status indicator implemented.
- Event ingestion pipeline (frontend logger -> FastAPI Bronze -> Airflow/Spark -> Delta) implemented.

### In progress / partially aligned

- Auth UI currently still shows email/password style legacy fields although logic is OTP only.
- `src/components/Auth.tsx` is a re-export wrapper, while real UI is in `src/pages/Auth.tsx`.
- `user_stats` is read in header, but write/update path from learning completion is not yet visible in current code snapshot.

### Not yet implemented in code (roadmap perspective)

- Full UI decoupling from legacy auth form design.
- Explicit Phase-3/4-style MinIO-first Bronze and Silver pipeline hard switch (currently optional via env).
- Silver-layer curated model outputs and downstream serving endpoints.

## 8. Known Risks / Operational Notes

- Supabase email provider can hit rate limits (`email rate limit exceeded`) during repeated OTP tests.
- There are two `.env` scopes (repo root and nested frontend app). Misalignment can cause confusing behavior.
- Worktree currently includes modified `node_modules/*` files (11 files). This is usually undesirable for clean version control.
- Secrets are currently present in local env files; avoid committing actual credentials/keys.

## 9. Immediate Recommended Actions

1. Clean auth UI to reflect OTP-only behavior explicitly (remove password/signup-only visuals if not used).
2. Add concrete `user_stats` write/update flow on learning completion events.
3. Add SQL migration docs for `user_stats` + RLS policy scripts under versioned migrations.
4. Decide single source of truth for frontend env management and document it.
5. Clean `node_modules` modifications from git working tree before next commit.

## 10. Key File Map

- App entry / routing: `daily-spark-learn-main/daily-spark-learn-main/src/App.tsx`
- Auth context: `daily-spark-learn-main/daily-spark-learn-main/src/contexts/AuthContext.tsx`
- Header status/login: `daily-spark-learn-main/daily-spark-learn-main/src/components/Header.tsx`
- Auth UI/action: `daily-spark-learn-main/daily-spark-learn-main/src/pages/Auth.tsx`
- Auth wrapper: `daily-spark-learn-main/daily-spark-learn-main/src/components/Auth.tsx`
- Supabase client: `daily-spark-learn-main/daily-spark-learn-main/src/lib/supabaseClient.ts`
- Event logger: `daily-spark-learn-main/daily-spark-learn-main/src/lib/logger.ts`
- FastAPI ingest: `web/app.py`
- Airflow DAG: `airflow/dags/growit_etl.py`
- Spark ETL: `spark/app/job_etl.py`
- Infra definition: `docker-compose.yml`
