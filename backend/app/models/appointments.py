from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, Index
from app.core.db import Base
from datetime import datetime
class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    # keep doctor_id simple for now; we'll add a proper FK when we create the doctors table
    doctor_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    # timezone-aware datetimes
    start_at: Mapped["datetime"] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    end_at: Mapped["datetime"] = mapped_column(DateTime(timezone=True), nullable=False, index=True)

    reason: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # link to the user who booked (FK later if you want; keeping it simple for now)
    created_by_user_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    # helpful composite index to accelerate overlap checks
    __table_args__ = (
        Index("ix_appt_doctor_time", "doctor_id", "start_at", "end_at"),
    )
