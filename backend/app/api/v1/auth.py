from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.schemas.users import UserCreate, UserRead
from app.repositories import user_repo
from sqlalchemy.exc import IntegrityError


router = APIRouter(prefix="/api/v1/auth", tags=["auth"]) 

@router.post("/signup", status_code=201, response_model=UserRead)
async def signup(payload: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    try:
        return user_repo.create(db, payload)
    except IntegrityError as e:
        msg = str(getattr(e, "orig", e))
        if "UNIQUE constraint failed: users.email" in msg:
            raise HTTPException(status_code=409, detail="Email already registered")
        # fallback: show the DB message so we know what's actually failing
        raise HTTPException(status_code=400, detail=f"DB integrity error: {msg}")