from pydantic import BaseModel, Field
from typing import Annotated, TypeAlias
from pydantic import StringConstraints




FullName : TypeAlias = Annotated[str, StringConstraints(min_length = 4, strip_whitespace=True)] 
PhoneNumber : TypeAlias = Annotated[str, StringConstraints(pattern=r"^\d{11}$")] 

class PatientCreate(BaseModel):
    full_name: FullName = Field(json_schema_extra={"example": "John Doe"})
    phone_number: PhoneNumber = Field(json_schemas_extra = {"example": "03041234567"})
    
class PatientRead(BaseModel):
    id: int
    full_name : str
    phone_number : str
    
    model_config = {
        "from_attributes":True
    }