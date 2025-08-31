from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database import get_db
from models import UserUpdate, UserResponse, User
from services.user_service import UserService
from services.auth_service import get_current_active_user


class UserController:
    def __init__(self):
        self.user_service = UserService()
    
    async def get_users(
        self,
        skip: int = 0,
        limit: int = 100,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
    ) -> List[UserResponse]:
        """ユーザー一覧を取得（管理者用）"""
        users = await self.user_service.get_users(db, skip=skip, limit=limit)
        return users
    
    async def get_user(
        self,
        user_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
    ) -> UserResponse:
        """特定のユーザーを取得"""
        user = await self.user_service.get_user(db, user_id=user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
        return user
    
    async def update_user(
        self,
        user_id: int,
        user: UserUpdate,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
    ) -> UserResponse:
        """ユーザーを更新"""
        updated_user = await self.user_service.update_user(db, user_id=user_id, user=user)
        if updated_user is None:
            raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
        return updated_user
    
    async def delete_user(
        self,
        user_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
    ) -> dict:
        """ユーザーを削除"""
        success = await self.user_service.delete_user(db, user_id=user_id)
        if not success:
            raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
        return {"message": "ユーザーが正常に削除されました"}
