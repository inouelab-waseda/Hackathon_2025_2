"use client";

import React, { useState, useEffect } from "react";
import { useQuestion } from "../hooks/useQuestion";

const QuestionComponent: React.FC = () => {
  const {
    loading,
    error,
    currentQuestion,
    currentNum,
    totalQuestions,
    sessionData,
    fetchQuestion,
    submitAnswer,
    fetchProposal,
    fetchSessionData,
    resetQuestionSession,
    clearError,
  } = useQuestion();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [proposal, setProposal] = useState<string | null>(null);
  const [showProposal, setShowProposal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // コンポーネントマウント時にセッションデータを取得
  useEffect(() => {
    console.log("QuestionComponent: Component mounted, fetching session data");
    const initializeSession = async () => {
      await fetchSessionData();
      setIsInitialized(true);
    };
    initializeSession();
  }, [fetchSessionData]);

  // 初期化後、質問がない場合は最初の質問を取得
  useEffect(() => {
    if (isInitialized && !currentQuestion && currentNum < totalQuestions) {
      console.log("QuestionComponent: Initializing first question", {
        current_num: currentNum,
        num_questions: totalQuestions,
      });
      fetchQuestion({
        current_num: currentNum,
        num_questions: totalQuestions,
      });
    }
  }, [
    isInitialized,
    currentQuestion,
    currentNum,
    totalQuestions,
    fetchQuestion,
  ]);

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    console.log("Submitting answer:", selectedAnswer);
    const result = await submitAnswer(selectedAnswer);
    if (result) {
      setSelectedAnswer(null);

      // 次の質問を取得
      if (currentNum < totalQuestions) {
        console.log("Fetching next question:", currentNum);
        await fetchQuestion({
          current_num: currentNum,
          num_questions: totalQuestions,
        });
      } else {
        // 全ての質問が完了したら提案を取得
        console.log("All questions completed, fetching proposal");
        const proposalResult = await fetchProposal();
        if (proposalResult) {
          setProposal(proposalResult.proposal);
          setShowProposal(true);
        }
      }
    }
  };

  const handleReset = async () => {
    const success = await resetQuestionSession();
    if (success) {
      setSelectedAnswer(null);
      setProposal(null);
      setShowProposal(false);
      // 最初の質問を取得
      await fetchQuestion({
        current_num: 0,
        num_questions: totalQuestions,
      });
    }
  };

  const answerOptions = ["はい", "いいえ", "わからない"];

  if (loading && !currentQuestion) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800">
              エラーが発生しました
            </h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            エラーをクリア
          </button>
        </div>
      </div>
    );
  }

  if (showProposal && proposal) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-3xl font-bold">あなたへの自分磨き提案</h2>
            </div>
            <p className="text-purple-100 text-lg">
              診断結果に基づいたパーソナライズされたアドバイス
            </p>
          </div>

          {/* 提案内容 */}
          <div className="p-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    パーソナライズされた提案
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {proposal}
                  </p>
                </div>
              </div>
            </div>

            {/* 質問履歴 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📝</span>
                </span>
                診断履歴
              </h3>
              <div className="grid gap-4">
                {sessionData?.questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 mb-2">
                          {question}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">回答:</span>
                          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium">
                            {sessionData.answers[index]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* リセットボタン */}
            <div className="mt-8 text-center">
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
              >
                🎯 新しい診断を始める
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold">自分磨き診断</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentNum}</div>
              <div className="text-purple-100">/ {totalQuestions}</div>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentNum / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 質問コンテンツ */}
        <div className="p-8">
          {currentQuestion ? (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
                  {currentQuestion}
                </h3>
              </div>

              <div className="grid gap-4 max-w-2xl mx-auto">
                {answerOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedAnswer(option)}
                    className={`p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedAnswer === option
                        ? "border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg"
                        : "border-gray-200 bg-white/60 backdrop-blur-sm hover:border-purple-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedAnswer === option
                            ? "bg-gradient-to-r from-purple-500 to-blue-600"
                            : "bg-gray-100"
                        }`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            selectedAnswer === option
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        >
                          {answerOptions.indexOf(option) + 1}
                        </span>
                      </div>
                      <span
                        className={`text-lg font-medium ${
                          selectedAnswer === option
                            ? "text-purple-700"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer || loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>送信中...</span>
                    </div>
                  ) : (
                    "回答を送信 ✨"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">質問を準備中...</p>
            </div>
          )}

          {/* 質問履歴 */}
          {sessionData && sessionData.questions.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📋</span>
                </span>
                これまでの質問
              </h3>
              <div className="grid gap-4">
                {sessionData.questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 mb-1">{question}</p>
                        {sessionData.answers[index] ? (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {sessionData.answers[index]}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                            回答待ち
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* 現在の質問も表示 */}
                {currentQuestion &&
                  !sessionData.questions.includes(currentQuestion) && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {currentNum}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 mb-1">
                            {currentQuestion}
                          </p>
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            現在の質問
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionComponent;
