"use client";

import React, { useState } from "react";
import { QuestionManager, type Answer } from "@/lib/question";
import "./question.css";

export default function QuestionPage() {
  const [questionManager] = useState(() => new QuestionManager());
  const [state, setState] = useState(questionManager.getState());
  const [progress, setProgress] = useState(questionManager.getProgress());

  const handleAnswer = (answer: Answer) => {
    questionManager.answerQuestion(answer);
    setState(questionManager.getState());
    setProgress(questionManager.getProgress());
  };

  const handleReset = () => {
    questionManager.reset();
    setState(questionManager.getState());
    setProgress(questionManager.getProgress());
  };

  const currentQuestion = questionManager.getCurrentQuestion();

  if (state.isComplete) {
    return (
      <div className="question-container">
        <div className="result-card">
          <h2 className="result-title">結果</h2>
          <p className="result-text">{state.result}</p>
          <button className="reset-button" onClick={handleReset}>
            もう一度始める
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="question-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress.percentage}%` }}
        ></div>
        <span className="progress-text">
          {progress.current} / {progress.total}
        </span>
      </div>

      <div className="question-card">
        <h2 className="question-title">質問 {progress.current}</h2>
        <p className="question-text">{currentQuestion?.text}</p>

        <div className="answer-buttons">
          <button
            className="answer-button yes-button"
            onClick={() => handleAnswer("yes")}
          >
            <span className="button-icon">👍</span>
            はい
          </button>

          <button
            className="answer-button no-button"
            onClick={() => handleAnswer("no")}
          >
            <span className="button-icon">👎</span>
            いいえ
          </button>

          <button
            className="answer-button unknown-button"
            onClick={() => handleAnswer("unknown")}
          >
            <span className="button-icon">🤔</span>
            わからない
          </button>
        </div>
      </div>
    </div>
  );
}
