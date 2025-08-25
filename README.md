# Hackathon 2025 Project

フロントエンドとバックエンドを含むフルスタック Web アプリケーション

## 🚀 プロジェクト構成

- `frontend/` - React Router v7 + Vite フロントエンド
- `backend/` - FastAPI バックエンド
- `docker-compose.yml` - Docker Compose 設定
- `Makefile` - 開発用コマンド集

## 📦 クイックスタート

### 1. 依存関係のインストール

```bash
make setup
```

### 2. アプリケーションの起動

```bash
# Docker Composeで起動（推奨）
make up

# または、ローカルで同時起動
make dev
```

### 3. アクセス

- **フロントエンド**: http://localhost:5173
- **バックエンド API**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs

## 🛠️ Makefile コマンド一覧

### 📦 セットアップ

```bash
make setup             # 開発環境の初期セットアップ
make install-frontend  # フロントエンド依存関係をインストール
make install-backend   # バックエンド依存関係をインストール
```

### 🐳 Docker での起動

```bash
make build             # Dockerイメージをビルド
make up                # Docker Composeでアプリケーションを起動
make up-frontend       # フロントエンドのみDockerで起動
make up-backend        # バックエンドのみDockerで起動
make down              # アプリケーションを停止
make logs              # ログを表示
make logs-frontend     # フロントエンドのログを表示
make logs-backend      # バックエンドのログを表示
make clean             # コンテナとイメージを削除
```

### 💻 ローカル開発

```bash
make dev               # フロントエンドとバックエンドを同時起動
make dev-frontend      # フロントエンド開発サーバーを起動 (http://localhost:5173)
make dev-backend       # バックエンド開発サーバーを起動 (http://localhost:8000)
```

### 🧪 テスト・品質管理

```bash
make test-frontend     # フロントエンドテストを実行
make test-backend      # バックエンドテストを実行
make lint-frontend     # フロントエンドリンターを実行
make lint-backend      # バックエンドリンターを実行
make format-frontend   # フロントエンドコードをフォーマット
make format-backend    # バックエンドコードをフォーマット
make typecheck-frontend # TypeScript型チェック
```

### 🔧 その他

```bash
make security-check    # セキュリティチェック
make update-deps       # 依存関係の更新
make production-build  # 本番用ビルド
make help              # ヘルプを表示
```

## 🎯 開発ワークフロー

### 初回セットアップ

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd hackathon_2025_2

# 2. 開発環境をセットアップ
make setup

# 3. アプリケーションを起動
make up
```

### 日常的な開発

```bash
# アプリケーションを起動
make up

# ログを確認
make logs

# アプリケーションを停止
make down

# コードをフォーマット
make format-frontend
make format-backend

# テストを実行
make test-frontend
make test-backend
```

## 🔗 アクセス先

### バックエンド

- **API サーバー**: http://localhost:8000
- **Swagger UI（API 文書）**: http://localhost:8000/docs
- **ReDoc（API 文書）**: http://localhost:8000/redoc

### フロントエンド

- **開発サーバー**: http://localhost:5173

## 📋 API エンドポイント

- `GET /` - ルートエンドポイント
- `GET /health` - ヘルスチェック
- `GET /api/items` - アイテム一覧取得
- `GET /api/items/{item_id}` - 特定アイテム取得

## 🛠️ 技術スタック

### フロントエンド

- **React Router v7** - ルーティング
- **Vite** - ビルドツール
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング

### バックエンド

- **FastAPI** - Web フレームワーク
- **Uvicorn** - ASGI サーバー
- **Pydantic** - データバリデーション
- **Python 3.x** - プログラミング言語

### インフラ

- **Docker** - コンテナ化
- **Docker Compose** - マルチコンテナ管理
