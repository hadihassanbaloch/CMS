from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.api.v1.auth import get_current_user  # reuse your bearer dependency
from app.models.appointments import Appointment
from app.models.users import User

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])

@router.get("/appointments")
async def list_appointments_with_users(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),  # TODO: add role check later
):
    """
    Admin view: list all appointments joined with user info.
    (We keep response untyped/dict for speed; can add a pydantic model later.)
    """
    rows = (
        db.query(Appointment, User)
        .join(User, User.id == Appointment.created_by_user_id)
        .order_by(Appointment.start_at.asc(), Appointment.id.asc())
        .all()
    )

    result = []
    for appt, user in rows:
        result.append({
            "id": appt.id,
            "doctor_id": appt.doctor_id,
            "start_at": appt.start_at,
            "end_at": appt.end_at,
            "reason": appt.reason,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
            },
        })
    return result
