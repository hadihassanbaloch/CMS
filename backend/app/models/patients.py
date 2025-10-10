from sqlalchemy import Column, Integer, String
from app.core.db import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), index=True,nullable=False)
    phone_number = Column(String(11), index=True,nullable=False, unique=True)

