from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from database import get_db
from models import UserUpdate, UserResponse, User
from controllers.user_controller import UserController
from services.auth_service import get_current_active_user

user_router = APIRouter(prefix="/api/users", tags=["ユーザー"])
user_controller = UserController()

@user_router.get("/", response_model=List[UserResponse])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await user_controller.get_users(skip=skip, limit=limit, db=db, current_user=current_user)

@user_router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await user_controller.get_user(user_id=user_id, db=db, current_user=current_user)

@user_router.put("/{user_id}", response_model=UserResponse)
async def update_existing_user(
    user_id: int,
    user: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await user_controller.update_user(user_id=user_id, user=user, db=db, current_user=current_user)

@user_router.delete("/{user_id}")
async def delete_existing_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await user_controller.delete_user(user_id=user_id, db=db, current_user=current_user)
