from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.users import User
from app.schemas.users import UserCreate
from app.core.security import hash_password
from typing import Optional

def get_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_by_google_id(db: Session, google_id: str) -> User | None:
    return db.query(User).filter(User.google_id == google_id).first()

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

def create_or_update_google_user(
    db: Session, 
    google_id: str, 
    email: str, 
    full_name: str, 
    profile_picture: Optional[str] = None
) -> User:
    """
    Create a new Google OAuth user or update existing one
    """
    # First check if user exists by Google ID
    user = get_by_google_id(db, google_id)
    
    if user:
        # Update existing user with latest info from Google
        user.full_name = full_name
        user.profile_picture = profile_picture
        db.commit()
        db.refresh(user)
        return user
    
    # Check if user exists by email (maybe they registered manually before)
    user = get_by_email(db, email)
    
    if user:
        # Link existing account to Google
        user.google_id = google_id
        user.profile_picture = profile_picture
        db.commit()
        db.refresh(user)
        return user
    
    # Create new user
    user = User(
        email=email,
        full_name=full_name,
        google_id=google_id,
        profile_picture=profile_picture,
        hashed_password=None  # Google OAuth users don't have passwords
    )
    
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
        return user
    except IntegrityError:
        db.rollback()
        raise ValueError("Email already registered")