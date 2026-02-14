# 2026-02-14 학습 통계 시스템 수정 내역

## 1. 작업 목적
- FastAPI + React + PostgreSQL 기반에서 학습 시간/연속 학습일(스트릭)을 추적하는 Learning Data Loop를 구현.
- 범위: `UserStats` DB 모델 추가, Study API 2개 추가, Header/Learn UI 연동.

## 2. 기능 변경 상세

### 2.1 Backend

#### `web/models.py`
- `UserStats` 모델 추가.
- `User`와 `UserStats`를 1:1 관계로 연결.
- 컬럼:
  - `id` (PK)
  - `user_id` (FK users.id, unique)
  - `last_study_date` (Date, nullable)
  - `current_streak` (default 0)
  - `today_study_minutes` (default 0)
  - `total_study_minutes` (default 0)

#### `web/auth.py` (신규)
- JWT 인증 기반 `get_current_user` 의존성 분리.
- 기존 `app.py` 내부 인증 로직을 재사용 가능한 모듈로 정리.

#### `web/routers/study.py` (신규)
- `GET /api/study/stats`
  - 현재 사용자 통계 조회.
  - `last_study_date != today`면 응답의 `today_study_minutes`를 0으로 반환.
- `POST /api/study/progress`
  - 입력: `{ "minutes": int }`
  - 동작:
    - 통계 row get-or-create
    - 스트릭 계산
      - 어제 학습: +1
      - 어제보다 이전 학습: 1로 리셋
      - 오늘 이미 학습: 유지
    - 날짜가 오늘이 아니면 `today_study_minutes` 초기화 후 누적
    - `total_study_minutes` 누적
    - `last_study_date`를 오늘로 갱신

#### `web/app.py`
- `study` 라우터 등록 (`app.include_router(study_router)`).
- 인증 의존성 import를 `web/auth.py`로 교체.
- `Base.metadata.create_all(bind=engine)` 유지 (신규 `UserStats` 자동 생성 대상 포함).

### 2.2 Frontend

#### `daily-spark-learn-main/daily-spark-learn-main/src/components/Header.tsx`
- 로그인 상태에서 `/api/study/stats` 호출.
- `current_streak`, `today_study_minutes`를 실제 값으로 표시.
- `study-stats:refresh` 전역 이벤트 수신 시 재조회.
- 로그아웃 시 로컬 표시값 초기화.

#### `daily-spark-learn-main/daily-spark-learn-main/src/pages/Learn.tsx`
- 학습 완료 시 `/api/study/progress` POST 호출.
- 성공 시 `study-stats:refresh` 이벤트 발행하여 Header를 즉시 갱신.
- 동일 세션 중복 전송 방지(`hasReportedProgress`) 추가.
- 학습 시간은 페이지 진입 시점부터 완료 시점까지 경과 분(`Math.ceil`)로 계산, 최소 1분.

## 3. API 동작 기준 (2026-02-14 반영)

### `GET /api/study/stats`
- 사용자 통계 row가 없으면 기본값 반환:
  - `current_streak=0`, `today_study_minutes=0`, `total_study_minutes=0`, `last_study_date=null`
- row가 있어도 `last_study_date`가 오늘이 아니면 `today_study_minutes=0`으로 응답.

### `POST /api/study/progress`
- `minutes` 유효 범위: `1..1440`.
- 날짜 비교는 `date.today()` 기준.
- today/yesterday/older 분기와 분 누적 규칙이 요청사항과 일치.

## 4. 검증 결과 요약

### 4.1 Backend 실검증
- `docker compose up -d --build web` 실행 성공.
- 컨테이너 내부 `GET /api/health` 응답 확인.
- 실제 API 호출 시나리오 통과:
  - 초기 stats 조회
  - 같은 날 progress 2회 누적
  - `last_study_date=어제` 강제 후 streak 증가 확인
  - `last_study_date=3일 전` 강제 후 streak 리셋 확인
  - `GET /api/study/stats` 엣지케이스 (`last_study_date` 과거일 때 `today_study_minutes=0`) 확인
- 특정 사용자 강제 검증:
  - 계정: `kjh109304@naver.com`
  - 반영값: `today_study_minutes=30`, `current_streak=3`, `last_study_date=2026-02-14`
  - API 응답으로 동일 값 확인 완료.

### 4.2 Frontend 실검증
- `npm i` 실행됨.
- `npm run build` 실패:
  - 원인: `@rollup/rollup-linux-x64-gnu` optional dependency 누락 (npm optional dependency 이슈).
- 타입체크는 통과:
  - `npx tsc --noEmit` 성공.

## 5. 2026-02-14 기준 Working Tree 변경 전체 (`git status --short`)
- `M daily-spark-learn-main/daily-spark-learn-main/src/components/Header.tsx`
- `M daily-spark-learn-main/daily-spark-learn-main/src/contexts/AuthContext.tsx`
- `M daily-spark-learn-main/daily-spark-learn-main/src/pages/Learn.tsx`
- `M node_modules/@types/node/README.md`
- `M node_modules/@types/phoenix/README.md`
- `M node_modules/@types/ws/README.md`
- `M node_modules/tslib/CopyrightNotice.txt`
- `M node_modules/tslib/LICENSE.txt`
- `M node_modules/tslib/README.md`
- `M node_modules/tslib/modules/index.js`
- `M node_modules/tslib/modules/package.json`
- `M node_modules/tslib/tslib.d.ts`
- `M node_modules/tslib/tslib.es6.js`
- `M node_modules/tslib/tslib.js`
- `M web/app.py`
- `M web/models.py`
- `M web/security.py`
- `?? web/auth.py`
- `?? web/routers/`

## 6. 비고
- `AuthContext.tsx`, `web/security.py`는 기능 차이보다 줄바꿈(CRLF/LF) 중심 diff로 확인됨.
- `node_modules` 변경은 환경 설치/정리 과정에서 발생한 변경으로, 기능 구현 소스와 분리해서 관리하는 것을 권장.
