from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import timedelta
import uvicorn

from database import get_db, init_db
from models import Item, User
from schemas import (
    ItemCreate, ItemUpdate, ItemResponse,
    UserCreate, UserUpdate, UserResponse,
    HealthResponse, Token, UserLogin
)
from crud import (
    create_item, get_items, get_item, update_item, delete_item,
    create_user, get_users, get_user, update_user, delete_user,
    get_user_by_email
)
from auth import (
    authenticate_user, create_access_token, get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

app = FastAPI(
    title="Hackathon 2025 API",
    description="Backend API for Hackathon 2025 project with SQLite database and JWT authentication",
    version="1.0.0"
)

# CORS設定（フロントエンドとの連携用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# アプリケーション起動時にデータベースを初期化
@app.on_event("startup")
async def startup_event():
    await init_db()

# ルートエンドポイント
@app.get("/")
async def root():
    return {"message": "Welcome to Hackathon 2025 API with SQLite and JWT authentication"}

# ヘルスチェックエンドポイント
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="API is running successfully with SQLite database and JWT authentication"
    )

# Hello エンドポイント
@app.get("/hello", response_model=HealthResponse)
async def hello():
    return HealthResponse(
        status="hello",
        message="API is running successfully"
    )
# 認証エンドポイント（フォームデータ用）
@app.post("/api/auth/login", response_model=Token)
async def login(
    email: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
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

# 認証エンドポイント（JSON用）
@app.post("/api/auth/login/json", response_model=Token)
async def login_json(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
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

@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    email: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    db: AsyncSession = Depends(get_db)
):
    # メールアドレスの重複チェック
    existing_user = await get_user_by_email(db, email=email)
    if existing_user:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に使用されています")
    
    # UserCreateオブジェクトを作成
    user_data = UserCreate(email=email, password=password, full_name=full_name)
    return await create_user(db=db, user=user_data)

@app.post("/api/auth/register/json", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_json(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # メールアドレスの重複チェック
    existing_user = await get_user_by_email(db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に使用されています")
    
    return await create_user(db=db, user=user)

# 現在のユーザー情報取得
@app.get("/api/auth/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# Item API エンドポイント
@app.post("/api/items", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_new_item(
    item: ItemCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return await create_item(db=db, item=item)

@app.get("/api/items", response_model=List[ItemResponse])
async def read_items(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    items = await get_items(db, skip=skip, limit=limit)
    return items

@app.get("/api/items/{item_id}", response_model=ItemResponse)
async def read_item(
    item_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = await get_item(db, item_id=item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    return item

@app.put("/api/items/{item_id}", response_model=ItemResponse)
async def update_existing_item(
    item_id: int, 
    item: ItemUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    updated_item = await update_item(db, item_id=item_id, item=item)
    if updated_item is None:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    return updated_item

@app.delete("/api/items/{item_id}")
async def delete_existing_item(
    item_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    success = await delete_item(db, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail="アイテムが見つかりません")
    return {"message": "アイテムが正常に削除されました"}

# User API エンドポイント（管理者用）
@app.get("/api/users", response_model=List[UserResponse])
async def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    users = await get_users(db, skip=skip, limit=limit)
    return users

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    user = await get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return user

@app.put("/api/users/{user_id}", response_model=UserResponse)
async def update_existing_user(
    user_id: int, 
    user: UserUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    updated_user = await update_user(db, user_id=user_id, user=user)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return updated_user

@app.delete("/api/users/{user_id}")
async def delete_existing_user(
    user_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    success = await delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")
    return {"message": "ユーザーが正常に削除されました"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
