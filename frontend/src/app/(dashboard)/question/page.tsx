"use client";

import { useState, useEffect } from "react";
import "./question.css";

interface Question {
  id: number;
  text: string;
  yesCount: number;
  noCount: number;
}

export default function QuestionPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    // サンプル質問データ
    const sampleQuestions: Question[] = [
      {
        id: 1,
        text: "あなたは人前で話すことが好きですか？",
        yesCount: 30,
        noCount: 70,
      },
      {
        id: 2,
        text: "あなたは新しい技術を学ぶことが好きですか？",
        yesCount: 80,
        noCount: 20,
      },
      {
        id: 3,
        text: "あなたはチームで働くことが好きですか？",
        yesCount: 60,
        noCount: 40,
      },
      {
        id: 4,
        text: "あなたは細かい作業が得意ですか？",
        yesCount: 45,
        noCount: 55,
      },
      {
        id: 5,
        text: "あなたは創造的な仕事が好きですか？",
        yesCount: 70,
        noCount: 30,
      },
    ];

    setQuestions(sampleQuestions);
    setIsLoading(false);
  }, []);

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 全ての質問に回答した場合、結果を表示
      showResult();
    }
  };

  const showResult = () => {
    const yesAnswers = Object.values(answers).filter((answer) => answer).length;
    const totalQuestions = questions.length;

    let personalityType = "";
    if (yesAnswers >= totalQuestions * 0.8) {
      personalityType = "外向的で積極的なタイプ";
    } else if (yesAnswers >= totalQuestions * 0.6) {
      personalityType = "バランスの取れたタイプ";
    } else if (yesAnswers >= totalQuestions * 0.4) {
      personalityType = "慎重で思慮深いタイプ";
    } else {
      personalityType = "内向的で控えめなタイプ";
    }

    setResult(personalityType);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="question-container">
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="question-container">
        <div className="result-section">
          <h2>診断結果</h2>
          <div className="result-text">{result}</div>
          <button onClick={resetQuiz} className="reset-button">
            もう一度診断する
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="question-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-section">
        <h2>
          質問 {currentQuestionIndex + 1} / {questions.length}
        </h2>
        <div className="question-text">{currentQuestion.text}</div>

        <div className="answer-buttons">
          <button
            onClick={() => handleAnswer(true)}
            className="answer-button yes-button"
          >
            はい
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="answer-button no-button"
          >
            いいえ
          </button>
        </div>
      </div>
    </div>
  );
}
