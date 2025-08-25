# Hackathon 2025 Project

フロントエンドとバックエンドを含むフルスタック Web アプリケーション

## プロジェクト構成

- `frontend/` - React + Vite フロントエンド
- `backend/` - FastAPI バックエンド

## 起動方法

### 方法 1: Docker Compose を使用（推奨）

プロジェクトルートディレクトリで以下を実行：

```bash
# プロジェクト全体（frontend + backend）を起動
docker-compose up --build

# バックエンドのみ起動
docker-compose up backend --build
```

### 方法 2: 個別に直接実行

#### バックエンドの起動

```bash
cd backend

# 依存関係をインストール
pip install -r requirements.txt

# サーバーを起動
python main.py
```

## アクセス先

### バックエンド

- API サーバー: http://localhost:8000
- Swagger UI（API 文書）: http://localhost:8000/docs
- ReDoc（API 文書）: http://localhost:8000/redoc

### フロントエンド

- 開発サーバー: http://localhost:3000（フロントエンドを起動した場合）

## API エンドポイント

- `GET /` - ルートエンドポイント
- `GET /health` - ヘルスチェック
- `GET /api/items` - アイテム一覧取得
- `GET /api/items/{item_id}` - 特定アイテム取得
