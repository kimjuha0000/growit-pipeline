from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    stats = relationship("UserStats", back_populates="user", uselist=False, cascade="all, delete-orphan")


class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    last_study_date = Column(Date, nullable=True)
    current_streak = Column(Integer, nullable=False, default=0)
    today_study_minutes = Column(Integer, nullable=False, default=0)
    total_study_minutes = Column(Integer, nullable=False, default=0)

    user = relationship("User", back_populates="stats")
