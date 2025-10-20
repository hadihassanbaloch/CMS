from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, Field, StringConstraints, model_validator

# ---------- shared validators / aliases ----------
Reason = Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=200)]


# ---------- request model ----------
class AppointmentCreate(BaseModel):
    doctor_id: int = Field(gt=0, json_schema_extra={"example": 1})
    start_at: datetime = Field(json_schema_extra={"example": "2025-10-15T10:00:00+05:00"})
    end_at: datetime = Field(json_schema_extra={"example": "2025-10-15T10:30:00+05:00"})
    reason: Optional[Reason] = Field(default=None, json_schema_extra={"example": "Follow-up for blood pressure"})

    @model_validator(mode="after")
    def _check_times(self):
        # require timezone-aware datetimes
        if self.start_at.tzinfo is None or self.end_at.tzinfo is None:
            raise ValueError("start_at and end_at must include timezone information (e.g., +05:00 or Z)")

        if self.end_at <= self.start_at:
            raise ValueError("end_at must be after start_at")
        return self


# ---------- response model ----------
class AppointmentRead(BaseModel):
    id: int
    doctor_id: int
    start_at: datetime
    end_at: datetime
    reason: Optional[str] = None
    created_by_user_id: int  # the authenticated user who booked it

    # allow ORM instances to be serialized automatically
    model_config = {"from_attributes": True}
