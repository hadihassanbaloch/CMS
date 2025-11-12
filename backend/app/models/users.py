from sqlalchemy import Column, Integer, String, Boolean
from app.core.db import Base
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(50), unique=False, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)  # nullable for Google OAuth users
    google_id = Column(String(255), unique=True, nullable=True, index=True)  # Google OAuth ID
    profile_picture = Column(String(500), nullable=True)  # Google profile picture URL

    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="0")