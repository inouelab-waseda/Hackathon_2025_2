from fastapi import APIRouter, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import UserCreate, UserResponse, Token, UserLogin, User
from controllers.auth_controller import AuthController
from services.auth_service import get_current_active_user

auth_router = APIRouter(prefix="/api/auth", tags=["認証"])
auth_controller = AuthController()

# 認証エンドポイント（フォームデータ用）
@auth_router.post("/login", response_model=Token)
async def login(
    email: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    return await auth_controller.login(email=email, password=password, db=db)

# 認証エンドポイント（JSON用）
@auth_router.post("/login/json", response_model=Token)
async def login_json(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    return await auth_controller.login_json(user_credentials=user_credentials, db=db)

# ユーザー登録（フォームデータ用）
@auth_router.post("/register", response_model=UserResponse, status_code=201)
async def register(
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    db: AsyncSession = Depends(get_db)
):
    return await auth_controller.register(email=email, password=password, full_name=full_name, db=db)

# ユーザー登録（JSON用）
@auth_router.post("/register/json", response_model=UserResponse, status_code=201)
async def register_json(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await auth_controller.register_json(user=user, db=db)

# 現在のユーザー情報取得（認証必要）
@auth_router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return await auth_controller.get_current_user(current_user)
