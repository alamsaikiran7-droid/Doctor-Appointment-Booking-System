from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """
    Request schema for user registration.
    """

    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)


class LoginRequest(BaseModel):
    """
    Request schema for user login.
    """

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)


class TokenResponse(BaseModel):
    """
    Response schema returned after successful login.
    """

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """
    Data extracted after decoding JWT.
    """

    sub: str
    email: EmailStr
    role: str


class UserResponse(BaseModel):
    """
    User profile returned to frontend.
    """

    id: int
    full_name: str
    email: EmailStr
    role: str