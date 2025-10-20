from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.db import get_db
from app.schemas.users import UserCreate, UserRead, SigninRequest, Token
from app.repositories import user_repo
from sqlalchemy.exc import IntegrityError
from app.core.security import create_access_token, verify_password, SECRET_KEY, ALGORITHM
from app.models.users import User


router = APIRouter(prefix="/api/v1/auth", tags=["auth"]) 

bearer_scheme = HTTPBearer(auto_error=True)

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme), db: Session = Depends(get_db)) -> User:
    token = creds.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could Not validate credentials")
    user = db.get(User, int(sub))
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/me", response_model=UserRead)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

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
    
@router.post("/signin", response_model=Token)
async def singin(payload: SigninRequest, db: Session = Depends(get_db)) -> Token:
    user = user_repo.get_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=token)