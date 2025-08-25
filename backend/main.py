from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Hackathon 2025 API",
    description="Backend API for Hackathon 2025 project",
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

# レスポンスモデル
class HealthResponse(BaseModel):
    status: str
    message: str

class ItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

# ルートエンドポイント
@app.get("/")
async def root():
    return {"message": "Welcome to Hackathon 2025 API"}

# ヘルスチェックエンドポイント
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="API is running successfully"
    )

# サンプルAPIエンドポイント
@app.get("/api/items", response_model=List[ItemResponse])
async def get_items():
    sample_items = [
        ItemResponse(id=1, name="アイテム1", description="サンプルアイテム1の説明"),
        ItemResponse(id=2, name="アイテム2", description="サンプルアイテム2の説明"),
        ItemResponse(id=3, name="アイテム3", description="サンプルアイテム3の説明")
    ]
    return sample_items

@app.get("/api/items/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    return ItemResponse(
        id=item_id,
        name=f"アイテム{item_id}",
        description=f"ID {item_id} のアイテムの詳細情報"
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
