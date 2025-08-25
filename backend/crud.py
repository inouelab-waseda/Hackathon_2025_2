from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List, Optional
from models import Item, User
from schemas import ItemCreate, ItemUpdate, UserCreate, UserUpdate
from passlib.context import CryptContext

# パスワードハッシュ化の設定
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """パスワードのハッシュ化"""
    return pwd_context.hash(password)

# Item CRUD操作
async def create_item(db: AsyncSession, item: ItemCreate) -> Item:
    db_item = Item(**item.dict())
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return db_item

async def get_items(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Item]:
    result = await db.execute(
        select(Item).offset(skip).limit(limit).order_by(Item.created_at.desc())
    )
    return result.scalars().all()

async def get_item(db: AsyncSession, item_id: int) -> Optional[Item]:
    result = await db.execute(select(Item).where(Item.id == item_id))
    return result.scalar_one_or_none()

async def update_item(db: AsyncSession, item_id: int, item: ItemUpdate) -> Optional[Item]:
    update_data = item.dict(exclude_unset=True)
    if update_data:
        await db.execute(
            update(Item).where(Item.id == item_id).values(**update_data)
        )
        await db.commit()
        return await get_item(db, item_id)
    return None

async def delete_item(db: AsyncSession, item_id: int) -> bool:
    result = await db.execute(delete(Item).where(Item.id == item_id))
    await db.commit()
    return result.rowcount > 0

# User CRUD操作
async def create_user(db: AsyncSession, user: UserCreate) -> User:
    # パスワードをハッシュ化
    user_data = user.dict()
    hashed_password = get_password_hash(user_data.pop("password"))
    
    db_user = User(**user_data, hashed_password=hashed_password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
    result = await db.execute(
        select(User).offset(skip).limit(limit).order_by(User.created_at.desc())
    )
    return result.scalars().all()

async def get_user(db: AsyncSession, user_id: int) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def update_user(db: AsyncSession, user_id: int, user: UserUpdate) -> Optional[User]:
    update_data = user.dict(exclude_unset=True)
    
    # パスワードが含まれている場合はハッシュ化
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    if update_data:
        await db.execute(
            update(User).where(User.id == user_id).values(**update_data)
        )
        await db.commit()
        return await get_user(db, user_id)
    return None

async def delete_user(db: AsyncSession, user_id: int) -> bool:
    result = await db.execute(delete(User).where(User.id == user_id))
    await db.commit()
    return result.rowcount > 0
