from fastapi import HTTPException, status, Form, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from database import get_db
from models import UserCreate, UserResponse, Token, UserLogin
from services.auth_service import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from services.user_service import UserService


class AuthController:
    def __init__(self):
        self.user_service = UserService()
    
    async def login(
        self,
        email: str = Form(...),
        password: str = Form(...),
        db: AsyncSession = Depends(get_db)
    ) -> Token:
        """フォームデータを使用したログイン"""
        user = await authenticate_user(db, email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="メールアドレスまたはパスワードが正しくありません",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    async def login_json(
        self,
        user_credentials: UserLogin,
        db: AsyncSession = Depends(get_db)
    ) -> Token:
        """JSONデータを使用したログイン"""
        user = await authenticate_user(db, user_credentials.email, user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="メールアドレスまたはパスワードが正しくありません",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    async def register(
        self,
        email: str = Form(...),
        password: str = Form(...),
        full_name: str = Form(None),
        db: AsyncSession = Depends(get_db)
    ) -> UserResponse:
        """フォームデータを使用したユーザー登録"""
        # メールアドレスの重複チェック
        existing_user = await self.user_service.get_user_by_email(db, email=email)
        if existing_user:
            raise HTTPException(status_code=400, detail="このメールアドレスは既に使用されています")
        
        # UserCreateオブジェクトを作成
        user_data = UserCreate(email=email, password=password, full_name=full_name)
        return await self.user_service.create_user(db=db, user=user_data)
    
    async def register_json(
        self,
        user: UserCreate,
        db: AsyncSession = Depends(get_db)
    ) -> UserResponse:
        """JSONデータを使用したユーザー登録"""
        # メールアドレスの重複チェック
        existing_user = await self.user_service.get_user_by_email(db, email=user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="このメールアドレスは既に使用されています")
        
        return await self.user_service.create_user(db=db, user=user)
    
    async def get_current_user(self, current_user):
        """現在のユーザー情報取得"""
        return current_user
