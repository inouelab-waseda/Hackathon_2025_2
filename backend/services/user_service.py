from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database_models import User
from models.schemas import UserCreate, UserResponse
from .auth_service import get_password_hash

class UserService:
    async def create_user(self, db: AsyncSession, user: UserCreate) -> UserResponse:
        """ユーザーを作成"""
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            is_active=True
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return UserResponse(
            id=db_user.id,
            email=db_user.email,
            full_name=db_user.full_name,
            is_active=db_user.is_active
        )
    
    async def get_users(self, db: AsyncSession, skip: int = 0, limit: int = 100):
        """ユーザー一覧を取得"""
        result = await db.execute(select(User).offset(skip).limit(limit))
        users = result.scalars().all()
        return [
            UserResponse(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                is_active=user.is_active
            ) for user in users
        ]
    
    async def get_user(self, db: AsyncSession, user_id: int):
        """特定のユーザーを取得"""
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user is None:
            return None
        return UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active
        )
    
    async def get_user_by_email(self, db: AsyncSession, email: str):
        """メールアドレスでユーザーを取得"""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def update_user(self, db: AsyncSession, user_id: int, user_update):
        """ユーザーを更新"""
        result = await db.execute(select(User).where(User.id == user_id))
        db_user = result.scalar_one_or_none()
        if db_user is None:
            return None
        
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        await db.commit()
        await db.refresh(db_user)
        return UserResponse(
            id=db_user.id,
            email=db_user.email,
            full_name=db_user.full_name,
            is_active=db_user.is_active
        )
    
    async def delete_user(self, db: AsyncSession, user_id: int) -> bool:
        """ユーザーを削除"""
        result = await db.execute(select(User).where(User.id == user_id))
        db_user = result.scalar_one_or_none()
        if db_user is None:
            return False
        
        await db.delete(db_user)
        await db.commit()
        return True
