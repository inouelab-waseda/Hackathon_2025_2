# Hackathon 2025 Project Makefile

.PHONY: help build up up-frontend up-backend down logs logs-frontend logs-backend clean install-frontend install-backend dev dev-frontend dev-backend test-frontend test-backend lint-frontend lint-backend format-frontend format-backend typecheck-frontend setup production-build security-check update-deps

# デフォルトターゲット
help:
	@echo "🚀 Hackathon 2025 Project - 利用可能なコマンド:"
	@echo ""
	@echo "📦 セットアップ:"
	@echo "  make setup             - 開発環境の初期セットアップ"
	@echo "  make install-frontend  - フロントエンド依存関係をインストール"
	@echo "  make install-backend   - バックエンド依存関係をインストール"
	@echo ""
	@echo "🐳 Docker での起動:"
	@echo "  make build             - Dockerイメージをビルド"
	@echo "  make up                - Docker Composeでアプリケーションを起動"
	@echo "  make up-frontend       - フロントエンドのみDockerで起動"
	@echo "  make up-backend        - バックエンドのみDockerで起動"
	@echo "  make down              - アプリケーションを停止"
	@echo "  make logs              - ログを表示"
	@echo "  make logs-frontend     - フロントエンドのログを表示"
	@echo "  make logs-backend      - バックエンドのログを表示"
	@echo ""
	@echo "💻 ローカル開発:"
	@echo "  make dev               - フロントエンドとバックエンドを同時起動"
	@echo "  make dev-frontend      - フロントエンド開発サーバーを起動 (http://localhost:5173)"
	@echo "  make dev-backend       - バックエンド開発サーバーを起動 (http://localhost:8000)"
	@echo ""
	@echo "🧪 テスト・品質管理:"
	@echo "  make test-frontend     - フロントエンドテストを実行"
	@echo "  make test-backend      - バックエンドテストを実行"
	@echo "  make lint-frontend     - フロントエンドリンターを実行"
	@echo "  make lint-backend      - バックエンドリンターを実行"
	@echo "  make format-frontend   - フロントエンドコードをフォーマット"
	@echo "  make format-backend    - バックエンドコードをフォーマット"
	@echo "  make typecheck-frontend - TypeScript型チェック"
	@echo ""
	@echo "🔧 その他:"
	@echo "  make clean             - コンテナとイメージを削除"
	@echo "  make security-check    - セキュリティチェック"
	@echo "  make update-deps       - 依存関係の更新"
	@echo "  make production-build  - 本番用ビルド"

# Docker Compose コマンド
build:
	docker-compose build

up:
	@echo "🚀 Docker Composeでアプリケーションを起動中..."
	docker-compose up -d
	@echo "✅ アプリケーションが起動しました！"
	@echo "📱 フロントエンド: http://localhost:3000"
	@echo "🔧 バックエンド: http://localhost:8000"
	@echo "📊 API ドキュメント: http://localhost:8000/docs"

up-frontend:
	@echo "🎨 フロントエンドのみをDockerで起動中..."
	docker-compose up -d frontend
	@echo "✅ フロントエンドが起動しました！"
	@echo "📱 アクセス: http://localhost:3000"

up-backend:
	@echo "🐍 バックエンドのみをDockerで起動中..."
	docker-compose up -d backend
	@echo "✅ バックエンドが起動しました！"
	@echo "🔧 API: http://localhost:8000"
	@echo "📊 ドキュメント: http://localhost:8000/docs"

down:
	@echo "🛑 アプリケーションを停止中..."
	docker-compose down
	@echo "✅ アプリケーションが停止しました"

logs:
	docker-compose logs -f

logs-frontend:
	docker-compose logs -f frontend

logs-backend:
	docker-compose logs -f backend

clean:
	@echo "🧹 コンテナとイメージを削除中..."
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f
	@echo "✅ クリーンアップが完了しました"

# フロントエンド関連
install-frontend:
	cd frontend && npm install

dev-frontend:
	@echo "🎨 フロントエンド開発サーバーを起動中..."
	@echo "📱 アクセス: http://localhost:3000"
	cd frontend && npm run dev

build-frontend:
	@echo "🏗️ フロントエンドをビルド中..."
	cd frontend && npm run build
	@echo "✅ フロントエンドのビルドが完了しました"

test-frontend:
	@echo "🧪 フロントエンドテストを実行中..."
	cd frontend && npm test

lint-frontend:
	@echo "🔍 フロントエンドのコード品質をチェック中..."
	cd frontend && npm run lint

format-frontend:
	@echo "✨ フロントエンドのコードをフォーマット中..."
	cd frontend && npm run format

typecheck-frontend:
	@echo "🔍 TypeScript型チェックを実行中..."
	cd frontend && npm run typecheck

# バックエンド関連
install-backend:
	cd backend && pip install -r requirements.txt

dev-backend:
	@echo "🐍 バックエンド開発サーバーを起動中..."
	@echo "🔧 API: http://localhost:8000"
	@echo "📊 ドキュメント: http://localhost:8000/docs"
	@echo "🔄 依存関係をチェック中..."
	@if ! command -v uvicorn >/dev/null 2>&1; then \
		echo "⚠️  uvicornが見つかりません。バックエンドの依存関係をインストールします..."; \
		cd backend && pip install -r requirements.txt; \
	fi
	@echo "✅ 依存関係のチェックが完了しました"
	@echo "🔄 サーバーを起動中..."
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

test-backend:
	@echo "🧪 バックエンドテストを実行中..."
	cd backend && python -m pytest

lint-backend:
	@echo "🔍 バックエンドのコード品質をチェック中..."
	cd backend && flake8 .
	cd backend && black --check .
	cd backend && isort --check-only .

format-backend:
	@echo "✨ バックエンドのコードをフォーマット中..."
	cd backend && black .
	cd backend && isort .

# 開発環境セットアップ
setup: install-frontend install-backend
	@echo "✅ 開発環境のセットアップが完了しました！"
	@echo ""
	@echo "💡 推奨: Python仮想環境を使用することをお勧めします"
	@echo "  python -m venv venv"
	@echo "  source venv/bin/activate  # macOS/Linux"
	@echo "  # または"
	@echo "  venv\\Scripts\\activate     # Windows"
	@echo ""
	@echo "🚀 次のコマンドでアプリケーションを起動できます："
	@echo "  make up              - Docker Composeで起動"
	@echo "  make dev             - ローカルで同時起動"
	@echo "  make dev-frontend    - フロントエンドのみ起動"
	@echo "  make dev-backend     - バックエンドのみ起動"

# 開発サーバー起動（ローカル）
dev:
	@echo "🚀 フロントエンドとバックエンドを同時起動中..."
	@echo "📱 フロントエンド: http://localhost:3000"
	@echo "🔧 バックエンド: http://localhost:8000"
	@echo "📊 API ドキュメント: http://localhost:8000/docs"
	@echo ""
	@echo "💡 ヒント: 別々のターミナルで起動する場合は："
	@echo "  ターミナル1: make dev-backend"
	@echo "  ターミナル2: make dev-frontend"
	@echo ""
	@echo "🔄 依存関係をチェック中..."
	@echo "=================================="
	@echo "バックエンドの依存関係をチェック中..."
	@if ! command -v uvicorn >/dev/null 2>&1; then \
		echo "⚠️  uvicornが見つかりません。バックエンドの依存関係をインストールします..."; \
		cd backend && pip install -r requirements.txt; \
	fi
	@echo "フロントエンドの依存関係をチェック中..."
	@if [ ! -d "frontend/node_modules" ]; then \
		echo "⚠️  node_modulesが見つかりません。フロントエンドの依存関係をインストールします..."; \
		cd frontend && npm install; \
	fi
	@echo "✅ 依存関係のチェックが完了しました"
	@echo ""
	@echo "🔄 起動中... (Ctrl+C で停止)"
	@echo "=================================="
	@echo "バックエンドを起動中..."
	@cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
	@echo "フロントエンドを起動中..."
	@cd frontend && npm run dev &
	@wait

# 本番ビルド
production-build: build-frontend
	@echo "✅ 本番用ビルドが完了しました"
	@echo "📦 ビルドファイル: frontend/build/"

# データベース関連（必要に応じて追加）
# db-migrate:
# 	cd backend && alembic upgrade head

# db-rollback:
# 	cd backend && alembic downgrade -1

# セキュリティチェック
security-check:
	cd frontend && npm audit
	cd backend && safety check

# 依存関係の更新
update-deps:
	cd frontend && npm update
	cd backend && pip install --upgrade -r requirements.txt
