from sqlalchemy.orm import Session
from app.models.patients import Patient
from app.schemas.patients import PatientCreate  # adjust path if your file is named differently

def create(db: Session, payload: PatientCreate) -> Patient:
    obj = Patient(full_name=payload.full_name, phone_number=payload.phone_number)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def list_all(db: Session) -> list[Patient]:
    return db.query(Patient).order_by(Patient.id).all()

def get_by_id(db: Session, patient_id: int) -> Patient | None:
    return db.get(Patient, patient_id)  # SQLAlchemy 2.0 style
