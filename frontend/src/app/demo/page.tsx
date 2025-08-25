"use client";

import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                アキネーター
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                サインアップ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            デモ: 性格診断の流れ
          </h1>
          <p className="text-xl text-gray-600">
            実際の診断がどのように行われるかをご紹介します
          </p>
        </div>

        {/* デモセクション */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">診断の流れ</h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  サインアップ
                </h3>
                <p className="text-gray-600">
                  簡単な情報を入力してアカウントを作成します。メールアドレスとパスワードのみで始められます。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  質問に回答
                </h3>
                <p className="text-gray-600">
                  シンプルな「はい」「いいえ」の質問に答えていきます。約5分程度で完了します。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  結果を確認
                </h3>
                <p className="text-gray-600">
                  AIが分析したあなたの性格タイプを確認できます。詳細な分析結果もご覧いただけます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* サンプル質問 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            サンプル質問
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-900 mb-3">
                「あなたは人前で話すことが好きですか？」
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium">
                  はい
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium">
                  いいえ
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-gray-900 mb-3">
                「あなたは新しい技術を学ぶことが好きですか？」
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium">
                  はい
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium">
                  いいえ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            実際に試してみませんか？
          </h3>
          <p className="text-gray-600 mb-6">
            無料でアカウントを作成して、あなたの性格を診断してみましょう
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            無料でサインアップ
          </Link>
        </div>
      </div>
    </div>
  );
}
