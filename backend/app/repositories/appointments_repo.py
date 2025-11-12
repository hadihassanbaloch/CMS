from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime

from app.models.appointments import Appointment, AppointmentStatus, ClinicType
from app.schemas.appointments import AppointmentCreate, AppointmentUpdate


def create(db: Session, payload: AppointmentCreate, created_by_user_id: Optional[int] = None, payment_proof_path: Optional[str] = None) -> Appointment:
    """
    Create a new appointment with the provided details.
    
    Args:
        db: Database session
        payload: Validated appointment data from API
        created_by_user_id: ID of the user creating the appointment
    
    Returns:
        Appointment: The newly created appointment object
    """
    # Step 1: Create new Appointment object with all required fields
    obj = Appointment(
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        clinic=payload.clinic,
        service_required=payload.service_required,
        preferred_date=payload.preferred_date,
        preferred_time=payload.preferred_time,
        payment_reference=payload.payment_reference,
        payment_proof=payment_proof_path,  # Add payment proof path
        message=payload.message,  # Can be None
        created_by_user_id=created_by_user_id,
        status=AppointmentStatus.PENDING,  # Default status
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    
    # Step 2: Add to database session
    db.add(obj)
    
    # Step 3: Commit transaction to save permanently
    db.commit()
    
    # Step 4: Refresh object to get updated data from DB (ID, etc.)
    db.refresh(obj)
    
    # Step 5: Return the saved appointment
    return obj


def get_by_status(db: Session, status: AppointmentStatus) -> List[Appointment]:
    """
    Get all appointments with a specific status.
    
    Args:
        db: Database session
        status: The appointment status to filter by (PENDING, CONFIRMED, etc.)
    
    Returns:
        List[Appointment]: All appointments with the specified status, ordered by date/time
    """
    return (
        db.query(Appointment)
        .filter(Appointment.status == status)
        .order_by(
            Appointment.preferred_date.desc(),  # Newest dates first
            Appointment.preferred_time.desc(),  # Latest times first 
            Appointment.id.desc()               # Most recent IDs first
        )
        .all()
    )


def get_by_email(db: Session, email: str) -> List[Appointment]:
    """
    Get all appointments for a specific email address (patient history).
    
    Args:
        db: Database session
        email: Patient's email address
    
    Returns:
        List[Appointment]: All appointments for this email, ordered by newest first
    """
    return (
        db.query(Appointment)
        .filter(Appointment.email == email)
        .order_by(
            Appointment.preferred_date.desc(),  # Newest dates first
            Appointment.preferred_time.desc(),  # Latest times first
            Appointment.id.desc()               # Most recent bookings first
        )
        .all()
    )


def list_all(db: Session) -> List[Appointment]:
    """
    Get all appointments in the system.
    
    Args:
        db: Database session
    
    Returns:
        List[Appointment]: All appointments ordered by newest date/time first
    """
    return (
        db.query(Appointment)
        .order_by(
            Appointment.preferred_date.desc(),  # Newest dates first
            Appointment.preferred_time.desc(),  # Latest times first
            Appointment.id.desc()               # Most recent IDs first
        )
        .all()
    )


def update(db: Session, appointment_id: int, payload: AppointmentUpdate) -> Optional[Appointment]:
    """
    Update an appointment with new data.
    
    Args:
        db: Database session
        appointment_id: ID of appointment to update
        payload: Fields to update (only provided fields will be changed)
    
    Returns:
        Optional[Appointment]: Updated appointment or None if not found
    """
    # Step 1: Find the appointment
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        return None
    
    # Step 2: Update only the provided fields
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(appointment, field, value)
    
    # Step 3: Update the timestamp
    appointment.updated_at = datetime.utcnow()
    
    # Step 4: Save changes
    db.commit()
    db.refresh(appointment)
    
    # Step 5: Return updated appointment
    return appointment


def get_by_user_id(db: Session, user_id: int) -> List[Appointment]:
    """
    Get all appointments created by a specific user.
    
    Args:
        db: Database session
        user_id: ID of the user who created the appointments
    
    Returns:
        List[Appointment]: All appointments for this user, ordered by newest first
    """
    return (
        db.query(Appointment)
        .filter(Appointment.created_by_user_id == user_id)
        .order_by(
            Appointment.preferred_date.desc(),  # Newest dates first
            Appointment.preferred_time.desc(),  # Latest times first
            Appointment.id.desc()               # Most recent bookings first
        )
        .all()
    )


def get_by_id(db: Session, appointment_id: int) -> Optional[Appointment]:
    """
    Get a single appointment by its ID.
    
    Args:
        db: Database session
        appointment_id: ID of the appointment to retrieve
    
    Returns:
        Optional[Appointment]: The appointment if found, None otherwise
    """
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()


def delete(db: Session, appointment_id: int) -> bool:
    """
    Delete an appointment by its ID.
    
    Args:
        db: Database session
        appointment_id: ID of the appointment to delete
    
    Returns:
        bool: True if appointment was deleted, False if not found
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        return False
    
    db.delete(appointment)
    db.commit()
    return True