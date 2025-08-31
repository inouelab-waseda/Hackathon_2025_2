# アキネーター風性格診断アプリ - バックエンド

FastAPI と SQLite を使用したバックエンド API です。JWT 認証機能と Google Gemini API による性格分析機能を提供します。

## 機能

- **SQLite データベース**: 軽量で高速な SQLite データベースを使用
- **非同期処理**: SQLAlchemy の非同期機能を活用
- **JWT 認証**: セキュアなトークンベース認証
- **パスワードハッシュ化**: bcrypt による安全なパスワード保存
- **性格分析**: Google Gemini API を使用した高度な性格診断
- **質問管理**: 動的な質問生成と回答処理
- **RESTful API**: ユーザーと質問の CRUD 操作
- **自動ドキュメント**: FastAPI の自動生成ドキュメント
- **MVC パターン**: 保守性とスケーラビリティを重視したアーキテクチャ

## アーキテクチャ

このプロジェクトは MVC（Model-View-Controller）パターンに従って設計されています。

### ディレクトリ構造

```
backend/
├── models/                 # データモデル層
│   ├── __init__.py
│   ├── database_models.py  # SQLAlchemyモデル（Userのみ）
│   └── schemas.py         # Pydanticスキーマ
├── routes/                 # ルーティング層
│   ├── __init__.py
│   ├── auth_routes.py     # 認証関連ルート
│   ├── user_routes.py     # ユーザー関連ルート
│   └── question_routes.py # 質問関連ルート
├── controllers/            # コントローラー層
│   ├── __init__.py
│   ├── auth_controller.py # 認証コントローラー
│   ├── user_controller.py # ユーザーコントローラー
│   └── question_controller.py # 質問コントローラー
├── services/               # ビジネスロジック層
│   ├── __init__.py
│   ├── auth_service.py    # 認証サービス
│   ├── user_service.py    # ユーザーサービス
│   └── question_service.py # 質問サービス
├── main_mvc.py            # MVC版メインアプリケーション
└── main.py                # 従来版メインアプリケーション
```

### MVC パターンの役割分担

#### Model（モデル）

- **データベースモデル** (`models/database_models.py`): SQLAlchemy によるデータベーススキーマ
- **スキーマ** (`models/schemas.py`): Pydantic による API リクエスト/レスポンスの型定義

#### View（ビュー）

- **ルート定義** (`routes/`): FastAPI のルーター定義
- **エンドポイント** (`routes/*_routes.py`): HTTP エンドポイントの定義

#### Controller（コントローラー）

- **リクエスト処理** (`controllers/`): リクエストの受け取りとレスポンスの返却
- **バリデーション** (`controllers/*_controller.py`): 入力値の検証とエラーハンドリング

#### Service（サービス）

- **ビジネスロジック** (`services/`): アプリケーションの核心的な処理
- **データアクセス** (`services/*_service.py`): データベース操作と外部 API 呼び出し

## データベース構造

### Users テーブル

- `id`: 主キー
- `email`: メールアドレス（必須、一意）
- `hashed_password`: ハッシュ化されたパスワード（必須）
- `full_name`: フルネーム（オプション）
- `created_at`: 作成日時
- `is_active`: アクティブ状態

## セットアップ

### 前提条件

- Python 3.8 以上
- Google Gemini API キー

### 1. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 2. 環境変数の設定

Google Gemini API を使用するために、以下の環境変数を設定してください：

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

または、`.env`ファイルを作成：

```env
GEMINI_API_KEY=your-gemini-api-key
```

### 3. アプリケーションの起動

#### MVC 版（推奨）

```bash
python main_mvc.py
```

#### 従来版

```bash
python main.py
```

#### Uvicorn を使用

```bash
uvicorn main_mvc:app --reload --host 0.0.0.0 --port 8000
```

### 4. Docker での実行

```bash
# ビルド
docker build -t hackathon-backend-mvc .

# 実行（環境変数付き）
docker run -p 8000:8000 -e GEMINI_API_KEY=your_api_key hackathon-backend-mvc python main_mvc.py
```

## API エンドポイント

### 認証不要（公開エンドポイント）

- `GET /` - ルートエンドポイント
- `GET /health` - API の状態確認
- `GET /hello` - Hello エンドポイント
- `POST /api/auth/login` - ログイン
- `POST /api/auth/login/json` - ログイン（JSON）
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/register/json` - ユーザー登録（JSON）

### 認証必要（保護エンドポイント）

- `GET /api/auth/me` - 現在のユーザー情報取得
- `POST /api/questions` - 新しい質問を取得
- `POST /api/questions/answer` - 回答を保存
- `POST /api/questions/proposal` - 自分磨きの提案を取得
- `GET /api/questions/session` - 現在のセッションデータを取得
- `POST /api/questions/reset` - セッションをリセット
- `GET /api/users` - ユーザー一覧取得
- `GET /api/users/{user_id}` - 特定ユーザー取得
- `PUT /api/users/{user_id}` - ユーザー更新
- `DELETE /api/users/{user_id}` - ユーザー削除

## 認証システム

### 認証フロー

1. **フロントエンド**: すべての API 呼び出しで自動的に認証ヘッダーを付与
2. **バックエンド**: 保護エンドポイントで`get_current_active_user`依存関係を使用
3. **エラーハンドリング**: 401 エラー時は自動的にログアウト処理を実行

### 認証の使用方法

#### 1. ユーザー登録

```bash
curl -X POST "http://localhost:8000/api/auth/register/json" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "securepassword",
       "full_name": "John Doe"
     }'
```

#### 2. ログイン

```bash
curl -X POST "http://localhost:8000/api/auth/login/json" \
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

#### 3. 認証が必要な API の使用

```bash
curl -X POST "http://localhost:8000/api/questions" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     -H "Content-Type: application/json" \
     -d '{
       "current_num": 0,
       "num_questions": 5
     }'
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
- **API キー管理**: Google Gemini API キーの安全な管理
- **全 API 認証チェック**: 保護エンドポイントでの認証必須

## 移行のメリット

### 1. 関心の分離

- **Model**: データ構造とバリデーション
- **View**: ユーザーインターフェース（API エンドポイント）
- **Controller**: リクエスト処理とフロー制御
- **Service**: ビジネスロジック

### 2. 保守性の向上

- 各層が独立しているため、変更の影響範囲が限定される
- テストが書きやすい構造
- コードの再利用性が向上

### 3. スケーラビリティ

- 新しい機能の追加が容易
- チーム開発での作業分担が明確

## クリーンアップ

### 削除された機能

- **Item 関連**: フロントエンドで使用されていないため削除

  - `controllers/item_controller.py`
  - `services/item_service.py`
  - `routes/item_routes.py`
  - Item 関連のモデルとスキーマ

- **従来版ファイル**: MVC 版に移行したため削除

  - `main.py` (従来版メインアプリケーション)
  - `crud.py` (CRUD 操作)
  - `auth.py` (認証機能)
  - `genai_service.py` (GenAI サービス)
  - `models.py` (データベースモデル)
  - `schemas.py` (Pydantic スキーマ)

- **その他の不要ファイル**: 開発用ファイルを削除
  - `test_genai.py` (テストファイル)
  - `question.txt` (テキストファイル)
  - `answer.txt` (テキストファイル)
  - `__pycache__/` (Python キャッシュファイル)

### 残された機能

- **認証機能**: ログイン・登録・ユーザー管理
- **質問機能**: GenAI を使用した質問生成と回答管理
- **ユーザー管理**: ユーザー情報の CRUD 操作

## 開発

### 新しい機能の追加

1. `services/`に新しいサービスクラスを作成
2. `controllers/`に新しいコントローラーを作成
3. `routes/`に新しいルートを作成
4. `models/`に必要なスキーマを追加

### テストの追加

- 各層ごとにユニットテストを作成
- 統合テストでエンドポイントをテスト

### 設定の外部化

- 環境変数による設定管理
- 設定ファイルの分離

## データベースファイル

SQLite データベースファイル（`hackathon.db`）は自動的に作成されます。
このファイルは`.gitignore`に含まれているため、バージョン管理されません。

## 本番環境での注意事項

- `SECRET_KEY`を環境変数から取得するように変更
- より強力なパスワードポリシーの実装
- レート制限の追加
- HTTPS の使用
- データベースマイグレーション（Alembic などの使用を推奨）

## 注意事項

- 既存のフロントエンドとの互換性を維持
- 全 API で認証チェックが実装済み
