from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List

from app.models.appointments import Appointment
from app.schemas.appointments import AppointmentCreate

class AppointmentOverlapError(Exception):
    """Raised when a new appointment would overlap an existing one for the same doctor."""
    pass


def _find_overlap(
    db: Session,
    doctor_id: int,
    start_at,
    end_at,
) -> Appointment | None:
    """
    Returns an existing overlapping appt if any:
      overlap if: new.start < existing.end AND new.end > existing.start
    """
    return (
        db.query(Appointment)
        .filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.start_at < end_at,
                Appointment.end_at > start_at,
            )
        )
        .first()
    )


def create(db: Session, payload: AppointmentCreate, created_by_user_id: int) -> Appointment:
    """
    Create an appointment if it doesn't overlap with an existing one
    for the same doctor. Raises AppointmentOverlapError on conflict.
    """
    # 1) check overlap
    conflict = _find_overlap(
        db,
        doctor_id=payload.doctor_id,
        start_at=payload.start_at,
        end_at=payload.end_at,
    )
    if conflict:
        raise AppointmentOverlapError(
            f"Time slot overlaps existing appointment (id={conflict.id})"
        )

    # 2) persist
    obj = Appointment(
        doctor_id=payload.doctor_id,
        start_at=payload.start_at,
        end_at=payload.end_at,
        reason=payload.reason,
        created_by_user_id=created_by_user_id,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def list_all(db: Session) -> List[Appointment]:
    """Simple listing; we’ll add filters (by doctor/date) later."""
    return (
        db.query(Appointment)
        .order_by(Appointment.start_at.asc(), Appointment.id.asc())
        .all()
    )
