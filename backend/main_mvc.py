from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import init_db
from models import HealthResponse
from routes import auth_router, user_router, question_router

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

# ルーターの登録
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(question_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
