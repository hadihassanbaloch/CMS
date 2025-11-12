from pydantic import BaseModel, EmailStr, Field, StringConstraints
from typing import Annotated, TypeAlias, Optional

FullName: TypeAlias = Annotated[str, StringConstraints(min_length=4, max_length=50, strip_whitespace=True)]
Password: TypeAlias = Annotated[str, StringConstraints(min_length=8, max_length=128)]   

class UserCreate(BaseModel):
    full_name: FullName = Field(json_schema_extra={"example": "john_doe"})
    email: EmailStr = Field(json_schema_extra={"example": "john_doe@example.com"})
    password: Password = Field(json_schema_extra={"example": "strongpassword123"})
    
class GoogleSigninRequest(BaseModel):
    google_token: str = Field(json_schema_extra={"example": "google_id_token_here"})
    
class UserRead(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    is_admin: bool
    google_id: Optional[str] = None
    profile_picture: Optional[str] = None

    model_config = {
        "from_attributes": True}
    
class SigninRequest(BaseModel):
    email: EmailStr = Field(json_schema_extra={"example": "john_doe@example.com"})
    password: Password = Field(json_schema_extra={"example": "strongpassword123"})
    
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"