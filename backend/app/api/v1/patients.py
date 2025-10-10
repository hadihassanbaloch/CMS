from fastapi import APIRouter, HTTPException, Depends
from app.schemas.patients import PatientCreate, PatientRead
from app.core.db import get_db
from app.repositories import patient_repo
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1", )



@router.post("/patients", status_code=201, response_model=PatientRead)
async def create_patient( payload: PatientCreate, db: Session = Depends(get_db)) -> PatientRead:
    obj = patient_repo.create(db, payload)
    return obj
   
    

@router.get("/patients",response_model=list[PatientRead])
async def list_patients(db: Session = Depends(get_db)) -> list[PatientRead]:
    return patient_repo.list_all(db)


@router.get("/patients/{patient_id}", response_model=PatientRead)
async def get_patient(patient_id: int, db: Session = Depends(get_db)) -> PatientRead:
    obj = patient_repo.get_by_id(db, patient_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Patient not found")
    return obj