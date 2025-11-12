from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, field_validator
from app.models.appointments import ClinicType, ServiceType, AppointmentStatus

# ---------- request model ----------
class AppointmentCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120, json_schema_extra={"example": "John Doe"})
    phone: str = Field(min_length=10, max_length=20, json_schema_extra={"example": "+923001234567"})
    email: EmailStr = Field(json_schema_extra={"example": "john.doe@example.com"})
    
    clinic: ClinicType = Field(json_schema_extra={"example": "clinic_a"})
    service_required: ServiceType = Field(json_schema_extra={"example": "general_consultation"})
    preferred_date: str = Field(min_length=10, max_length=10, json_schema_extra={"example": "2025-11-15"})
    preferred_time: str = Field(min_length=5, max_length=8, json_schema_extra={"example": "14:30"})
    
    payment_reference: str = Field(min_length=5, max_length=100, json_schema_extra={"example": "TXN123456789"})
    message: Optional[str] = Field(default=None, max_length=1000, json_schema_extra={"example": "I have high blood pressure"})

    @field_validator('preferred_date')
    @classmethod
    def validate_date_format(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in YYYY-MM-DD format')
    
    @field_validator('preferred_time')
    @classmethod
    def validate_time_format(cls, v):
        try:
            datetime.strptime(v, '%H:%M')
            return v
        except ValueError:
            raise ValueError('Time must be in HH:MM format (24-hour)')
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        # Remove any spaces, dashes, or parentheses
        phone_clean = ''.join(filter(str.isdigit, v.replace('+', '')))
        if len(phone_clean) < 10:
            raise ValueError('Phone number must have at least 10 digits')
        return v


# ---------- response model ----------
class AppointmentRead(BaseModel):
    id: int
    full_name: str
    phone: str
    email: str
    clinic: ClinicType
    service_required: ServiceType
    preferred_date: str
    preferred_time: str
    payment_reference: str
    payment_proof: Optional[str] = None
    message: Optional[str] = None
    status: AppointmentStatus
    created_by_user_id: Optional[int] = None  # Allow None for public appointments
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ---------- update model ----------
class AppointmentUpdate(BaseModel):
    status: Optional[AppointmentStatus] = None
    payment_proof: Optional[str] = None
    message: Optional[str] = None

    model_config = {"from_attributes": True}
