from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.users import User
from app.schemas.users import UserCreate
from app.core.security import hash_password


def get_by_email(db: Session, email:str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def create(db: Session, payload: UserCreate) -> User:
    hashed = hash_password(payload.password)
    db_obj = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hashed
    )
    db.add(db_obj)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Email already registered")
    db.refresh(db_obj)
    return db_obj