export interface Question {
  id: number;
  text: string;
  category: string;
}

export type Answer = "yes" | "no" | "unknown";

export interface QuestionState {
  currentQuestionIndex: number;
  answers: Map<number, Answer>;
  isComplete: boolean;
  result?: string;
}

export class QuestionManager {
  private questions: Question[] = [
    {
      id: 1,
      text: "あなたは人間ですか？",
      category: "basic",
    },
    {
      id: 2,
      text: "あなたは動物ですか？",
      category: "basic",
    },
    {
      id: 3,
      text: "あなたは植物ですか？",
      category: "basic",
    },
    {
      id: 4,
      text: "あなたは食べ物ですか？",
      category: "basic",
    },
    {
      id: 5,
      text: "あなたは機械や電子機器ですか？",
      category: "basic",
    },
  ];

  private state: QuestionState = {
    currentQuestionIndex: 0,
    answers: new Map(),
    isComplete: false,
  };

  getCurrentQuestion(): Question | null {
    if (this.state.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.state.currentQuestionIndex];
  }

  getState(): QuestionState {
    return { ...this.state };
  }

  answerQuestion(answer: Answer): void {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return;

    this.state.answers.set(currentQuestion.id, answer);

    // 次の質問に進む
    this.state.currentQuestionIndex++;

    // すべての質問が完了したかチェック
    if (this.state.currentQuestionIndex >= this.questions.length) {
      this.state.isComplete = true;
      this.state.result = this.calculateResult();
    }
  }

  private calculateResult(): string {
    const yesAnswers = Array.from(this.state.answers.values()).filter(
      (a) => a === "yes"
    ).length;
    const noAnswers = Array.from(this.state.answers.values()).filter(
      (a) => a === "no"
    ).length;
    const unknownAnswers = Array.from(this.state.answers.values()).filter(
      (a) => a === "unknown"
    ).length;

    // 簡単な結果判定ロジック（実際のアプリではより複雑なアルゴリズムを使用）
    if (yesAnswers > noAnswers) {
      return "あなたは人間の可能性が高いです！";
    } else if (noAnswers > yesAnswers) {
      return "あなたは人間ではない可能性が高いです。";
    } else {
      return "判断が難しいです。もう一度質問に答えてみてください。";
    }
  }

  reset(): void {
    this.state = {
      currentQuestionIndex: 0,
      answers: new Map(),
      isComplete: false,
    };
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.state.currentQuestionIndex + 1,
      total: this.questions.length,
      percentage: Math.round(
        ((this.state.currentQuestionIndex + 1) / this.questions.length) * 100
      ),
    };
  }
}
