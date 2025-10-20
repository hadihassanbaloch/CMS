# app/startup_seed.py
import os
from sqlalchemy.orm import Session
from app.core.db import SessionLocal
from app.models.users import User
from app.core.security import hash_password

DEFAULT_ADMIN_EMAIL = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@clinic.com")
DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
DEV_ENABLE_DEFAULT_ADMIN = os.getenv("DEV_ENABLE_DEFAULT_ADMIN", "true").lower() == "true"
DEFAULT_ADMIN_RESET = os.getenv("DEFAULT_ADMIN_RESET", "false").lower() == "true"

def ensure_default_admin() -> None:
    """
    Dev-only seeder: ensures an admin user exists in cms.db.
    - Uses your existing SessionLocal and hashed_password column.
    - Does NOT create any new database.
    """
    if not DEV_ENABLE_DEFAULT_ADMIN:
        return

    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.email == DEFAULT_ADMIN_EMAIL).first()
        if user is None:
            admin = User(
                full_name="Administrator",
                email=DEFAULT_ADMIN_EMAIL,
                hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
                is_admin=True,
            )
            db.add(admin)
            db.commit()
        else:
            changed = False
            # Guarantee admin flag
            if not bool(user.is_admin):
                user.is_admin = True
                changed = True
            # Optional: reset password on startup
            if DEFAULT_ADMIN_RESET:
                user.hashed_password = hash_password(DEFAULT_ADMIN_PASSWORD)
                changed = True
            if changed:
                db.commit()
    finally:
        db.close()
