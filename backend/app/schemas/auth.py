from typing import Optional
from pydantic import BaseModel, Field

class UserRegisterRequest(BaseModel):
    phone_or_email: str = Field(..., description="Mobile number (e.g. 03001234567) or email address")
    full_name: str = Field(..., min_length=2, max_length=100, description="Farmer or user name")
    password: str = Field(..., min_length=4, max_length=100, description="Account password")
    district: Optional[str] = Field("Sukkur, Sindh", description="Primary agricultural district")

class UserLoginRequest(BaseModel):
    phone_or_email: str = Field(..., description="Mobile number or email address")
    password: str = Field(..., description="Account password")

class UserProfileResponse(BaseModel):
    id: str
    phone_or_email: str
    full_name: str
    district: str
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileResponse
