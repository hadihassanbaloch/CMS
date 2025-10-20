# app/api/v1/patients.py
from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.api.v1.auth import get_current_user
from app.models.users import User
from app.schemas.patients import PatientCreate, PatientRead, PatientUpdate
from app.repositories import patient_repo

router = APIRouter(
    prefix="/api/v1",
    tags=["patients"],
)

# --- helpers -----------------------------------------------------------------
def _require_admin(user: User) -> None:
    if not bool(user.is_admin):
        raise HTTPException(status_code=403, detail="Admin privileges required")


# --- create ------------------------------------------------------------------
@router.post("/patients", status_code=201, response_model=PatientRead)
async def create_patient(
    payload: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PatientRead:
    _require_admin(current_user)
    obj = patient_repo.create(db, payload)
    return obj


# --- list --------------------------------------------------------------------
@router.get("/patients", response_model=list[PatientRead])
async def list_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # auth required
) -> list[PatientRead]:
    return patient_repo.list_all(db)


# --- get one -----------------------------------------------------------------
@router.get("/patients/{patient_id}", response_model=PatientRead)
async def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # auth required
) -> PatientRead:
    obj = patient_repo.get_by_id(db, patient_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Patient not found")
    return obj


# --- search ------------------------------------------------------------------
@router.get("/patients/search/", response_model=list[PatientRead])
async def search_patients(
    query: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # auth required
) -> list[PatientRead]:
    return patient_repo.search(db, query)


# --- update (partial) --------------------------------------------------------
@router.put("/patients/{patient_id}", response_model=PatientRead)
async def update_patient(
    patient_id: int,
    payload: PatientUpdate,  # <-- partial update
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PatientRead:
    _require_admin(current_user)
    existing = patient_repo.get_by_id(db, patient_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")

    updated = patient_repo.update(db, patient_id, payload)
    return updated


# --- delete ------------------------------------------------------------------
@router.delete("/patients/{patient_id}", status_code=204)
async def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    _require_admin(current_user)
    existing = patient_repo.get_by_id(db, patient_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient_repo.delete(db, patient_id)
    return Response(status_code=204)
