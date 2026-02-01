import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import boto3
from botocore.config import Config
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from filelock import FileLock
from pydantic import BaseModel, Field

app = FastAPI()

# Environment variables
DATA_DIR = os.getenv("DATA_DIR", "/data")
AUTH_MODE = os.getenv("AUTH_MODE", "off")
USE_MINIO = os.getenv("USE_MINIO", "false").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "http://minio:9000")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "logs")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class EventIn(BaseModel):
    event_type: str
    user_id: Optional[str] = None
    anonymous_id: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


def _validate_auth(_authorization: Optional[str] = Header(default=None)) -> Optional[str]:
    if AUTH_MODE != "off":
        raise HTTPException(status_code=501, detail="Auth not enabled in this scope")
    return None


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


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
        "metadata": event.metadata,
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
