from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from datetime import datetime
import os

# データベースURL
DATABASE_URL = "sqlite+aiosqlite:///./hackathon.db"

# 非同期エンジンの作成
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # SQLクエリをログに出力（開発時のみ）
    connect_args={"check_same_thread": False}
)

# セッションクラスの作成
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# ベースクラスの作成
Base = declarative_base()

# データベースセッションの依存関係
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# データベースの初期化
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
