from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Item スキーマ
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool
    
    class Config:
        from_attributes = True

# User スキーマ
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

# 認証スキーマ
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 共通レスポンス
class HealthResponse(BaseModel):
    status: str
    message: str

# 質問関連スキーマ
class QuestionRequest(BaseModel):
    current_num: int = 0
    num_questions: int = 5

class QuestionResponse(BaseModel):
    question: str
    current_num: int
    total_questions: int

class AnswerRequest(BaseModel):
    answer: str
    current_num: int

class AnswerResponse(BaseModel):
    message: str
    current_num: int

class ProposalRequest(BaseModel):
    pass

class ProposalResponse(BaseModel):
    proposal: str
