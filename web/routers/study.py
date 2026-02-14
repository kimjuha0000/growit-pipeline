from datetime import date, timedelta
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User, UserStats

router = APIRouter(prefix="/api/study", tags=["study"])


class StudyProgressIn(BaseModel):
    minutes: int = Field(ge=1, le=1440)


def _serialize_stats(stats: UserStats, today: date) -> Dict[str, Any]:
    today_minutes = stats.today_study_minutes if stats.last_study_date == today else 0
    return {
        "current_streak": stats.current_streak,
        "today_study_minutes": today_minutes,
        "total_study_minutes": stats.total_study_minutes,
        "last_study_date": stats.last_study_date,
    }


def _default_stats() -> Dict[str, Any]:
    return {
        "current_streak": 0,
        "today_study_minutes": 0,
        "total_study_minutes": 0,
        "last_study_date": None,
    }


def _get_or_create_user_stats(db: Session, user_id: int) -> UserStats:
    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if stats:
        return stats

    stats = UserStats(user_id=user_id)
    db.add(stats)
    db.flush()
    return stats


@router.get("/stats")
def get_study_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    today = date.today()
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    if not stats:
        return _default_stats()
    return _serialize_stats(stats, today)


@router.post("/progress")
def update_study_progress(
    payload: StudyProgressIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    today = date.today()
    yesterday = today - timedelta(days=1)
    stats = _get_or_create_user_stats(db, current_user.id)

    last_study_date: Optional[date] = stats.last_study_date

    if last_study_date == yesterday:
        stats.current_streak = stats.current_streak + 1 if stats.current_streak > 0 else 1
    elif last_study_date != today:
        stats.current_streak = 1

    if last_study_date != today:
        stats.today_study_minutes = 0

    stats.today_study_minutes += payload.minutes
    stats.total_study_minutes += payload.minutes
    stats.last_study_date = today

    db.commit()
    db.refresh(stats)

    return _serialize_stats(stats, today)
