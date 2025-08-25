# FastAPI Backend

Hackathon 2025 プロジェクトのバックエンド API

## 特徴

- FastAPI フレームワークを使用
- CORS 対応（フロントエンドとの連携）
- Docker コンテナで実行可能
- 自動 API 文書生成

## ローカル開発環境での実行

### 方法 1: 直接実行

```bash
# 依存関係をインストール
pip install -r requirements.txt

# サーバーを起動
python main.py
```

## API エンドポイント

- `GET /` - ルートエンドポイント
- `GET /health` - ヘルスチェック
- `GET /api/items` - アイテム一覧取得
- `GET /api/items/{item_id}` - 特定アイテム取得

## API 文書

サーバー起動後、以下の URL で API 文書を確認できます：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 開発時の注意事項

- ポート 8000 で起動します
- フロントエンド（localhost:3000）からの CORS を許可しています
- ホットリロードが有効です（ファイル変更時に自動再起動）
