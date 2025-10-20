# app/schemas/patients.py
from typing import Annotated, TypeAlias, Optional
from pydantic import BaseModel, Field, StringConstraints

# --- Type aliases / validators ---
FullName: TypeAlias = Annotated[str, StringConstraints(min_length=4, strip_whitespace=True)]
# exactly 11 digits (e.g., "03xxxxxxxxx"); adjust later if you add country codes
PhoneNumber: TypeAlias = Annotated[str, StringConstraints(pattern=r"^\d{11}$", strip_whitespace=True)]

# --- Create ---
class PatientCreate(BaseModel):
    full_name: FullName = Field(json_schema_extra={"example": "John Doe"})
    phone_number: PhoneNumber = Field(json_schema_extra={"example": "03041234567"})

# --- Read ---
class PatientRead(BaseModel):
    id: int
    full_name: str
    phone_number: str

    model_config = {"from_attributes": True}

# --- Update (partial) ---
class PatientUpdate(BaseModel):
    full_name: Optional[FullName] = Field(default=None, json_schema_extra={"example": "Jane Doe"})
    phone_number: Optional[PhoneNumber] = Field(default=None, json_schema_extra={"example": "03041234567"})

    # Forbid unknown fields during update so we don't silently accept unsupported keys
    model_config = {"extra": "forbid"}
