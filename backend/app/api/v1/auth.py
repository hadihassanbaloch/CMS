from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional
from app.core.db import get_db
from app.schemas.users import UserCreate, UserRead, SigninRequest, Token, GoogleSigninRequest
from app.repositories import user_repo
from sqlalchemy.exc import IntegrityError
from app.core.security import create_access_token, verify_password, verify_google_token, SECRET_KEY, ALGORITHM
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

def get_current_user_optional(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)), 
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get current user if token is provided, otherwise return None"""
    if not creds:
        return None
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            return None
        user = db.get(User, int(sub))
        return user
    except JWTError:
        return None

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

@router.post("/google-signin", response_model=Token)
async def google_signin(payload: GoogleSigninRequest, db: Session = Depends(get_db)) -> Token:
    """
    Sign in or sign up a user with Google OAuth
    """
    try:
        # Verify the Google token and extract user info
        google_user_info = verify_google_token(payload.google_token)
        
        # Create or update user in database
        user = user_repo.create_or_update_google_user(
            db=db,
            google_id=google_user_info["google_id"],
            email=google_user_info["email"],
            full_name=google_user_info["name"],
            profile_picture=google_user_info.get("picture")
        )
        
        # Create JWT token for the user
        token = create_access_token(data={"sub": str(user.id)})
        return Token(access_token=token)
        
    except ValueError as e:
        # Token verification failed or user creation failed
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        # Unexpected error
        raise HTTPException(status_code=500, detail="Google authentication failed")