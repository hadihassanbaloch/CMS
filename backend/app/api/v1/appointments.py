from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.api.v1.auth import get_current_user   # or from app.api.v1.auth if you kept it inline
from app.schemas.appointments import AppointmentCreate, AppointmentRead
from app.repositories import appointments_repo
from app.repositories.appointments_repo import AppointmentOverlapError
from app.models.users import User

router = APIRouter(prefix="/api/v1", tags=["Appointments"])

@router.post("/appointments", response_model=AppointmentRead, status_code=201)
async def create_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AppointmentRead:
    try:
        appt = appointments_repo.create(db, payload, created_by_user_id=current_user.id)
        return appt
    except AppointmentOverlapError as e:
        # same doctor_id & overlapping timeslot
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/appointments", response_model=list[AppointmentRead])
async def list_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AppointmentRead]:
    return appointments_repo.list_all(db)
