import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import boto3
from botocore.config import Config
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from filelock import FileLock
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from auth import get_current_user
from database import Base, engine, get_db
from models import User
from routers.study import router as study_router
from security import create_access_token, get_password_hash, verify_password

app = FastAPI()

# Environment variables
DATA_DIR = os.getenv("DATA_DIR", "/data")
AUTH_MODE = os.getenv("AUTH_MODE", "off")
USE_MINIO = os.getenv("USE_MINIO", "false").lower() == "true"


def _parse_cors_origins(raw: str) -> List[str]:
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


CORS_ORIGINS = _parse_cors_origins(
    os.getenv("CORS_ORIGINS", "http://localhost:8080,http://127.0.0.1:8080")
)
CORS_ALLOW_ORIGIN_REGEX = os.getenv("CORS_ALLOW_ORIGIN_REGEX", r"^https://.*\.vercel\.app$").strip() or None

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "http://minio:9000")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "logs")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_origin_regex=CORS_ALLOW_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(study_router)


class EventIn(BaseModel):
    event_type: str
    user_id: Optional[str] = None
    anonymous_id: Optional[str] = None
    event_version: int = Field(default=1, ge=1)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class SignupIn(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=6, max_length=128)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


def _serialize_user(user: User) -> Dict[str, Any]:
    return {
        "id": user.id,
        "email": user.email,
        "is_active": user.is_active,
    }


def _validate_auth(_authorization: Optional[str] = Header(default=None)) -> Optional[str]:
    if AUTH_MODE != "off":
        raise HTTPException(status_code=501, detail="Auth not enabled in this scope")
    return None


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/signup")
def signup(payload: SignupIn, db: Session = Depends(get_db)) -> Dict[str, Any]:
    email = _normalize_email(payload.email)
    password = payload.password

    if "@" not in email:
        raise HTTPException(status_code=400, detail="Valid email required")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": _serialize_user(user),
    }


@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Dict[str, Any]:
    email = _normalize_email(form_data.username)
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": _serialize_user(user),
    }


@app.get("/api/users/me")
def read_users_me(current_user: User = Depends(get_current_user)) -> Dict[str, Any]:
    return _serialize_user(current_user)


@app.post("/api/events")
def collect_event(event: EventIn, auth_user_id: Optional[str] = Depends(_validate_auth)) -> Dict[str, str]:
    if not event.user_id and not event.anonymous_id:
        raise HTTPException(status_code=400, detail="user_id or anonymous_id required")

    event_id = str(uuid.uuid4())
    received_at = datetime.now(timezone.utc).isoformat()

    user_id = event.user_id or auth_user_id
    anonymous_id = event.anonymous_id

    payload = {
        "event_id": event_id,
        "received_at": received_at,
        "event_type": event.event_type,
        "user_id": user_id,
        "anonymous_id": anonymous_id,
        "event_version": event.event_version,
        # Keep bronze schema stable while preserving all metadata.
        "metadata_json": json.dumps(event.metadata, ensure_ascii=False, sort_keys=True),
    }

    now = datetime.now(timezone.utc)
    date_path = now.strftime("%Y/%m/%d")
    hour_stamp = now.strftime("%Y%m%d-%H")
    dir_path = os.path.join(DATA_DIR, "bronze", "app", date_path)
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, f"part-{hour_stamp}.jsonl")
    lock_path = f"{file_path}.lock"

    with FileLock(lock_path):
        with open(file_path, "a", encoding="utf-8") as handle:
            handle.write(json.dumps(payload, ensure_ascii=False))
            handle.write("\n")

    if USE_MINIO:
        _upload_minio(file_path, os.path.join("bronze", "app", date_path, f"part-{hour_stamp}.jsonl"))

    return {"event_id": event_id}


def _upload_minio(local_path: str, object_key: str) -> None:
    client = boto3.client(
        "s3",
        endpoint_url=MINIO_ENDPOINT,
        aws_access_key_id=MINIO_ACCESS_KEY,
        aws_secret_access_key=MINIO_SECRET_KEY,
        config=Config(s3={"addressing_style": "path"}),
        region_name="us-east-1",
    )
    with open(local_path, "rb") as handle:
        client.put_object(Bucket=MINIO_BUCKET, Key=object_key, Body=handle.read())
