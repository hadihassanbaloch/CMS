from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
from pathlib import Path

from app.core.db import get_db
from app.api.v1.auth import get_current_user, get_current_user_optional
from app.schemas.appointments import AppointmentCreate, AppointmentRead, AppointmentUpdate
from app.repositories import appointments_repo
from app.models.users import User
from app.models.appointments import AppointmentStatus

router = APIRouter(prefix="/api/v1", tags=["Appointments"])

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads/payment_proofs")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/appointments", response_model=AppointmentRead, status_code=201)
async def create_appointment(
    full_name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    clinic: str = Form(...),
    service_required: str = Form(...),
    preferred_date: str = Form(...),
    preferred_time: str = Form(...),
    payment_reference: str = Form(...),
    message: Optional[str] = Form(None),
    payment_proof: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> AppointmentRead:
    """Create a new appointment with optional payment proof upload."""
    
    # Create the appointment data
    appointment_data = AppointmentCreate(
        full_name=full_name,
        phone=phone,
        email=email,
        clinic=clinic,
        service_required=service_required,
        preferred_date=preferred_date,
        preferred_time=preferred_time,
        payment_reference=payment_reference,
        message=message
    )
    
    # Handle file upload if provided
    payment_proof_path = None
    if payment_proof and payment_proof.filename:
        # Create user-specific directory
        user_dir = UPLOAD_DIR
        if current_user:
            user_dir = UPLOAD_DIR / f"user_{current_user.id}"
            user_dir.mkdir(exist_ok=True)
        
        # Generate descriptive filename with user ID, timestamp, and session info
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = Path(payment_proof.filename).suffix
        session_id = str(uuid.uuid4())[:8]  # Short session identifier
        
        if current_user:
            # Format: userId_timestamp_sessionId_appointmentProof.ext
            descriptive_filename = f"user{current_user.id}_{timestamp}_{session_id}_appointment_proof{file_extension}"
        else:
            # For anonymous users (fallback)
            descriptive_filename = f"guest_{timestamp}_{session_id}_appointment_proof{file_extension}"
        
        file_path = user_dir / descriptive_filename
        
        # Save the file
        with open(file_path, "wb") as buffer:
            content = await payment_proof.read()
            buffer.write(content)
        
        payment_proof_path = str(file_path)

    # Create the appointment with payment proof path and user link
    appointment = appointments_repo.create(
        db, 
        appointment_data, 
        created_by_user_id=current_user.id if current_user else None, 
        payment_proof_path=payment_proof_path
    )

    return appointment


@router.get("/appointments", response_model=list[AppointmentRead])
async def list_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AppointmentRead]:
    """List all appointments."""
    return appointments_repo.list_all(db)


@router.get("/appointments/{appointment_id}", response_model=AppointmentRead)
async def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AppointmentRead:
    """Get a specific appointment by ID."""
    appointment = appointments_repo.get_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.get("/appointments/user/{user_id}", response_model=list[AppointmentRead])
async def get_user_appointments(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AppointmentRead]:
    """Get all appointments for a specific user."""
    return appointments_repo.get_by_user_id(db, user_id)


@router.get("/my-appointments", response_model=list[AppointmentRead])
async def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AppointmentRead]:
    """Get all appointments for the current authenticated user."""
    # Get appointments by both user_id and email for maximum coverage
    appointments_by_user_id = appointments_repo.get_by_user_id(db, current_user.id) if current_user.id else []
    appointments_by_email = appointments_repo.get_by_email(db, current_user.email)
    
    # Combine and deduplicate appointments
    all_appointments = appointments_by_user_id + appointments_by_email
    seen_ids = set()
    unique_appointments = []
    for appointment in all_appointments:
        if appointment.id not in seen_ids:
            seen_ids.add(appointment.id)
            unique_appointments.append(appointment)
    
    return unique_appointments


@router.get("/appointments/email/{email}", response_model=list[AppointmentRead])
async def get_appointments_by_email(
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AppointmentRead]:
    """Get all appointments for a specific email."""
    return appointments_repo.get_by_email(db, email)


@router.get("/appointments/status/{status}", response_model=list[AppointmentRead])
async def get_appointments_by_status(
    status: AppointmentStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[AppointmentRead]:
    """Get all appointments with a specific status."""
    return appointments_repo.get_by_status(db, status)


@router.put("/appointments/{appointment_id}", response_model=AppointmentRead)
async def update_appointment(
    appointment_id: int,
    payload: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AppointmentRead:
    """Update an appointment."""
    appointment = appointments_repo.update(db, appointment_id, payload)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete an appointment."""
    success = appointments_repo.delete(db, appointment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"message": "Appointment deleted successfully"}


@router.get("/appointments/{appointment_id}/payment-proof")
async def get_payment_proof(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download payment proof file for an appointment."""
    appointment = appointments_repo.get_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if not appointment.payment_proof or not os.path.exists(appointment.payment_proof):
        raise HTTPException(status_code=404, detail="Payment proof not found")
    
    return FileResponse(
        path=appointment.payment_proof,
        filename=f"PaymentProof_User{appointment.created_by_user_id or 'Guest'}_Appointment{appointment_id}_{appointment.preferred_date}{Path(appointment.payment_proof).suffix}"
    )
