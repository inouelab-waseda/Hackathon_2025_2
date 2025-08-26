# Hackathon 2025 Backend API

FastAPI と SQLite を使用したバックエンド API です。JWT 認証機能付き。

## 機能

- **SQLite データベース**: 軽量で高速な SQLite データベースを使用
- **非同期処理**: SQLAlchemy の非同期機能を活用
- **JWT 認証**: セキュアなトークンベース認証
- **パスワードハッシュ化**: bcrypt による安全なパスワード保存
- **RESTful API**: アイテムとユーザーの CRUD 操作
- **自動ドキュメント**: FastAPI の自動生成ドキュメント

## データベース構造

### Items テーブル

- `id`: 主キー
- `name`: アイテム名（必須）
- `description`: 説明（オプション）
- `created_at`: 作成日時
- `updated_at`: 更新日時
- `is_active`: アクティブ状態

### Users テーブル

- `id`: 主キー
- `email`: メールアドレス（必須、一意）
- `hashed_password`: ハッシュ化されたパスワード（必須）
- `full_name`: フルネーム（オプション）
- `created_at`: 作成日時
- `is_active`: アクティブ状態

## セットアップ

1. 依存関係のインストール:

```bash
pip install -r requirements.txt
```

2. アプリケーションの起動:

```bash
python main.py
```

または

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API エンドポイント

### 認証

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - 現在のユーザー情報取得

### ヘルスチェック

- `GET /health` - API の状態確認

### アイテム管理（認証必須）

- `GET /api/items` - アイテム一覧取得
- `POST /api/items` - アイテム作成
- `GET /api/items/{item_id}` - 特定アイテム取得
- `PUT /api/items/{item_id}` - アイテム更新
- `DELETE /api/items/{item_id}` - アイテム削除

### ユーザー管理（認証必須）

- `GET /api/users` - ユーザー一覧取得
- `GET /api/users/{user_id}` - 特定ユーザー取得
- `PUT /api/users/{user_id}` - ユーザー更新
- `DELETE /api/users/{user_id}` - ユーザー削除

## 認証の使用方法

### 1. ユーザー登録

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "securepassword",
       "full_name": "John Doe"
     }'
```

### 2. ログイン

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "securepassword"
     }'
```

レスポンス例:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. 認証が必要な API の使用

```bash
curl -X GET "http://localhost:8000/api/items" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## API ドキュメント

アプリケーション起動後、以下の URL で API ドキュメントを確認できます：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## セキュリティ

- **パスワードハッシュ化**: bcrypt アルゴリズムを使用
- **JWT トークン**: 30 分間有効なアクセストークン
- **CORS 設定**: フロントエンドとの安全な通信
- **入力バリデーション**: Pydantic による型安全性

## データベースファイル

SQLite データベースファイル（`hackathon.db`）は自動的に作成されます。
このファイルは`.gitignore`に含まれているため、バージョン管理されません。

## 開発

### 新しいモデルの追加

1. `models.py`にモデルクラスを追加
2. `schemas.py`に Pydantic スキーマを追加
3. `crud.py`に CRUD 操作を追加
4. `main.py`に API エンドポイントを追加

### データベースマイグレーション

現在の実装では、アプリケーション起動時に自動的にテーブルが作成されます。
本格的な運用では、Alembic などのマイグレーションツールの使用を推奨します。

### 本番環境での注意事項

- `SECRET_KEY`を環境変数から取得するように変更
- より強力なパスワードポリシーの実装
- レート制限の追加
- HTTPS の使用
