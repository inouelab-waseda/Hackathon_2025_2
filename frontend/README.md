# アキネーター風性格診断アプリ - フロントエンド

Next.js 15.5.0 を使用したアキネーター風の性格診断アプリケーションのフロントエンドです。

## 🚀 機能

### 認証前（未ログイン）

- **ランディングページ**: アプリの紹介と特徴説明
- **サインアップ**: モーダル形式のユーザー登録
- **デモページ**: アプリの機能紹介とサンプル質問

### 認証後（ログイン済み）

- **性格診断**: アキネーター風の質問に回答
- **結果表示**: AI 分析による性格タイプの診断結果
- **ナビゲーション**: ログアウト機能付きヘッダー

## 🛠 技術スタック

- **フレームワーク**: Next.js 15.5.0 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Context API
- **認証**: ローカルストレージベース
- **API**: サーバーアクション（Server Actions）

## 📁 プロジェクト構造

```
frontend/src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # 認証後のページグループ
│   │   ├── layout.tsx            # 認証後レイアウト（ナビゲーションバー付き）
│   │   └── question/             # 質問ページ
│   │       ├── page.tsx          # 性格診断ページ
│   │       └── question.css      # 質問ページのスタイル
│   ├── demo/                     # デモページ
│   │   └── page.tsx
│   ├── signup/                   # サインアップページ
│   │   └── page.tsx
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # ランディングページ
├── components/                   # 再利用可能コンポーネント
│   ├── Hello.tsx                 # 挨拶コンポーネント
│   ├── ProtectedRoute.tsx        # 認証保護コンポーネント
│   ├── SignupForm.tsx            # サインアップフォーム
│   └── SignupModal.tsx           # サインアップモーダル
├── contexts/                     # React Context
│   └── AuthContext.tsx           # 認証状態管理
├── hooks/                        # カスタムフック
│   └── useSignup.ts              # サインアップロジック
└── lib/                          # ユーティリティ
    └── actions/                  # サーバーアクション
        └── auth.ts               # 認証関連API
```

## 🚀 セットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm, yarn, pnpm, または bun

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 環境変数

`.env.local`ファイルを作成して以下の環境変数を設定：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📱 使用方法

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### ビルド

```bash
# 本番用ビルド
npm run build

# 本番サーバーの起動
npm start
```

## 🔐 認証フロー

1. **ランディングページ** (`/`): アプリの紹介
2. **サインアップ** (`/signup`): ユーザー登録
3. **認証成功**: 自動的に質問ページにリダイレクト
4. **質問ページ** (`/question`): 性格診断（認証必要）
5. **ログアウト**: ナビゲーションバーからログアウト

## 🎨 デザインシステム

- **カラーパレット**: Blue 系のグラデーション
- **コンポーネント**: Tailwind CSS による統一されたデザイン
- **レスポンシブ**: モバイルファーストのデザイン
- **アニメーション**: スムーズなトランジション効果

## 🔧 開発ガイド

### 新しいページの追加

1. `app/`ディレクトリに新しいディレクトリを作成
2. `page.tsx`ファイルを作成
3. 必要に応じてレイアウトファイルを追加

### コンポーネントの作成

1. `components/`ディレクトリに新しいコンポーネントを作成
2. TypeScript インターフェースを定義
3. 必要に応じてカスタムフックを作成

### 認証が必要なページの作成

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>認証が必要なコンテンツ</div>
    </ProtectedRoute>
  );
}
```

## 🧪 テスト

```bash
# テストの実行
npm test

# テストカバレッジの確認
npm run test:coverage
```

## 📦 デプロイ

### Vercel（推奨）

1. GitHub リポジトリを Vercel に接続
2. 環境変数を設定
3. 自動デプロイが有効

### その他のプラットフォーム

```bash
# 静的エクスポート
npm run export

# Docker
docker build -t akinaitor-frontend .
docker run -p 3000:3000 akinaitor-frontend
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🆘 トラブルシューティング

### よくある問題

**Q: 認証状態が保持されない**
A: ブラウザのローカルストレージが有効になっているか確認してください。

**Q: API エラーが発生する**
A: バックエンドサーバーが起動しているか、環境変数が正しく設定されているか確認してください。

**Q: ビルドエラーが発生する**
A: Node.js のバージョンが 18.0.0 以上であることを確認してください。

## 📞 サポート

問題が発生した場合は、GitHub の Issues ページで報告してください。
