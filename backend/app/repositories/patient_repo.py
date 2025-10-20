# app/repositories/patient_repo.py
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.patients import Patient
from app.schemas.patients import PatientCreate, PatientUpdate


def create(db: Session, payload: PatientCreate) -> Patient:
    obj = Patient(
        full_name=payload.full_name,
        phone_number=payload.phone_number,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def list_all(db: Session) -> list[Patient]:
    return db.query(Patient).order_by(Patient.id).all()


def get_by_id(db: Session, patient_id: int) -> Patient | None:
    return db.get(Patient, patient_id)


def update(db: Session, patient_id: int, payload: PatientUpdate) -> Patient:
    """
    Partial update: only fields present in payload are applied.
    """
    obj = db.get(Patient, patient_id)
    if not obj:
        return None  # let caller raise 404

    changes = payload.model_dump(exclude_unset=True)
    for k, v in changes.items():
        setattr(obj, k, v)

    db.commit()
    db.refresh(obj)
    return obj


def delete(db: Session, patient_id: int) -> bool:
    obj = db.get(Patient, patient_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True


def search(db: Session, query: str) -> list[Patient]:
    """
    Simple case-insensitive search on name and phone.
    Limits to 50 to avoid huge payloads.
    """
    q = (query or "").strip()
    if not q:
        return []

    like = f"%{q}%"
    return (
        db.query(Patient)
        .filter(
            or_(
                Patient.full_name.ilike(like),
                Patient.phone_number.like(like),  # numbers: LIKE is sufficient
            )
        )
        .order_by(Patient.full_name.asc(), Patient.id.asc())
        .limit(50)
        .all()
    )
