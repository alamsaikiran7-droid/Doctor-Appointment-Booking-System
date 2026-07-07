from pydantic import BaseModel, EmailStr, Field


class AdminLoginRequest(BaseModel):
    """
    Request schema for admin login.
    """
    email: EmailStr
    password: str


class AdminTokenResponse(BaseModel):
    """
    Response schema returned after successful admin login.
    """
    access_token: str
    token_type: str = "bearer"


class AdminTokenData(BaseModel):
    """
    Data extracted after decoding the admin JWT token.
    """
    sub: str
    email: EmailStr
    role: str


class AdminProfileResponse(BaseModel):
    """
    Response schema for fetching admin profile.
    """
    id: int
    full_name: str
    email: EmailStr
    role: str