from pydantic import BaseModel, EmailStr, Field, StringConstraints
from typing import Annotated, TypeAlias

FullName: TypeAlias = Annotated[str, StringConstraints(min_length=4, max_length=20, strip_whitespace=True)]
Password: TypeAlias = Annotated[str, StringConstraints(min_length=8, max_length=128)]   

class UserCreate(BaseModel):
    full_name: FullName = Field(json_schema_extra={"example": "john_doe"})
    email: EmailStr = Field(json_schema_extra={"example": "john_doe@example.com"})
    password: Password = Field(json_schema_extra={"example": "strongpassword123"})
    
class UserRead(BaseModel):
    id: int
    full_name: FullName
    email: EmailStr

    model_config = {
        "from_attributes": True}