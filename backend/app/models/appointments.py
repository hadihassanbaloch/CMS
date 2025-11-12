from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, Index, Enum as SQLEnum
from app.core.db import Base
from datetime import datetime
import enum

class ClinicType(str, enum.Enum):
    CLINIC_A = "clinic_a"
    CLINIC_B = "clinic_b"

class ServiceType(str, enum.Enum):
    GENERAL_CONSULTATION = "general_consultation"
    BARIATRIC_SURGERY = "bariatric_surgery"
    LAPAROSCOPIC_SURGERY = "laparoscopic_surgery"
    GENERAL_SURGERY = "general_surgery"
    METABOLIC_SURGERY = "metabolic_surgery"

class AppointmentStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Patient information
    full_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    
    # Appointment details
    clinic: Mapped[ClinicType] = mapped_column(SQLEnum(ClinicType), nullable=False)
    service_required: Mapped[ServiceType] = mapped_column(SQLEnum(ServiceType), nullable=False)
    preferred_date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD format
    preferred_time: Mapped[str] = mapped_column(String(8), nullable=False)   # HH:MM format
    
    # Payment information
    payment_reference: Mapped[str] = mapped_column(String(100), nullable=False)
    payment_proof: Mapped[str | None] = mapped_column(String(500), nullable=True)  # File path or URL
    
    # Additional information
    message: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    
    # Status and metadata
    status: Mapped[AppointmentStatus] = mapped_column(SQLEnum(AppointmentStatus), default=AppointmentStatus.PENDING, nullable=False)
    created_by_user_id: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Indexes for better query performance
    __table_args__ = (
        Index("ix_appt_date_clinic", "preferred_date", "clinic"),
        Index("ix_appt_email_status", "email", "status"),
    )
