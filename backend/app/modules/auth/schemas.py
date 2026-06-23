from pydantic import BaseModel, Field


PHONE_PATTERN = r"^1\d{10}$"


class LoginRequest(BaseModel):
    phone: str = Field(pattern=PHONE_PATTERN)
    password: str = Field(min_length=6, max_length=128)


class AuthUser(BaseModel):
    member_no: str
    name: str
    phone: str
    email: str
    department: str
    role_code: str
    role_name: str
    status: str
    permissions: list[str]


class LoginData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: AuthUser
