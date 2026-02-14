# 2026-02-14 유저 검증 가이드 (학습 통계 강제 반영 포함)

## 1. 목적
- 특정 사용자 계정에 학습 통계를 강제로 반영하고,
- DB/API/UI에서 동일하게 보이는지 검증.

## 2. 사전 조건
- 작업 경로: `/mnt/c/Users/USER/growit-pipeline`
- Docker Desktop 실행 중
- `web`, `postgres` 컨테이너 기동 가능

## 3. 서비스 기동
```bash
cd /mnt/c/Users/USER/growit-pipeline
docker compose up -d --build web
```

## 4. 대상 사용자 확인
```bash
TARGET_EMAIL="kjh109304@naver.com"

docker compose exec -T postgres psql -U user -d growit -tAc \
"SELECT id, email FROM users WHERE email = '${TARGET_EMAIL}';"
```

기대 결과 예시:
```text
1|kjh109304@naver.com
```

## 5. 오늘 30분 / 3일 스트릭 강제 반영

아래 SQL은 `user_stats`가 없어도 생성하고, 있으면 업데이트한다.

```bash
TARGET_USER_ID=1
TARGET_STREAK=3
TARGET_TODAY_MINUTES=30
TARGET_TOTAL_MINUTES=30

docker compose exec -T postgres psql -U user -d growit -c \
"INSERT INTO user_stats (user_id, last_study_date, current_streak, today_study_minutes, total_study_minutes)
 VALUES (${TARGET_USER_ID}, CURRENT_DATE, ${TARGET_STREAK}, ${TARGET_TODAY_MINUTES}, ${TARGET_TOTAL_MINUTES})
 ON CONFLICT (user_id)
 DO UPDATE SET
   last_study_date = EXCLUDED.last_study_date,
   current_streak = EXCLUDED.current_streak,
   today_study_minutes = EXCLUDED.today_study_minutes,
   total_study_minutes = GREATEST(user_stats.total_study_minutes, EXCLUDED.total_study_minutes);"
```

## 6. DB 레벨 검증
```bash
docker compose exec -T postgres psql -U user -d growit -tAc \
"SELECT user_id, last_study_date, current_streak, today_study_minutes, total_study_minutes
 FROM user_stats
 WHERE user_id = ${TARGET_USER_ID};"
```

기대 결과 예시 (2026-02-14 실행 기준):
```text
1|2026-02-14|3|30|30
```

## 7. API 레벨 검증

### 방법 A: 계정 비밀번호를 아는 경우 (권장)
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${TARGET_EMAIL}&password=<PASSWORD>" \
  | python3 -c 'import sys, json; print(json.load(sys.stdin).get("access_token", ""))')

curl -s http://localhost:3000/api/study/stats \
  -H "Authorization: Bearer ${TOKEN}"
```

### 방법 B: 계정 비밀번호를 모르는 경우 (운영 검증용)
컨테이너 내부에서 JWT를 직접 발급해 조회.

```bash
docker compose exec -T web python - <<'PY'
import os
from jose import jwt
import urllib.request

secret = os.getenv('JWT_SECRET_KEY', 'change-this-in-production')
token = jwt.encode({'sub':'1','email':'kjh109304@naver.com'}, secret, algorithm='HS256')
req = urllib.request.Request('http://127.0.0.1:3000/api/study/stats', headers={'Authorization': f'Bearer {token}'})
with urllib.request.urlopen(req) as r:
    print(r.read().decode())
PY
```

기대 결과 예시:
```json
{"current_streak":3,"today_study_minutes":30,"total_study_minutes":30,"last_study_date":"2026-02-14"}
```

## 8. UI 검증
1. 브라우저에서 프론트 앱 로그인
2. Header 확인
3. `오늘 30분`, `🔥 3일` 표시 확인
4. 학습 완료 이벤트 후 값 즉시 갱신되는지 확인

## 9. 롤백(선택)
강제값을 원복하려면 아래처럼 업데이트.

```bash
docker compose exec -T postgres psql -U user -d growit -c \
"UPDATE user_stats
 SET current_streak = 0,
     today_study_minutes = 0,
     last_study_date = NULL
 WHERE user_id = ${TARGET_USER_ID};"
```

## 10. 트러블슈팅
- `localhost:3000` 직접 접속이 안 되면, `docker compose exec -T web` 내부에서 `127.0.0.1:3000`으로 호출해 확인.
- `npm run build` 실패 시 `@rollup/rollup-linux-x64-gnu` 누락 여부 확인.
