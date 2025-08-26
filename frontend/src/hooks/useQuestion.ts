import { useState, useCallback } from "react";
import {
  getQuestion,
  saveAnswer,
  getProposal,
  getSessionData,
  resetSession,
  QuestionRequest,
  AnswerRequest,
  QuestionResponse,
  AnswerResponse,
  ProposalResponse,
  SessionData,
} from "../lib/api";

export const useQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentNum, setCurrentNum] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const fetchQuestion = useCallback(async (request: QuestionRequest) => {
    console.log("fetchQuestion called with:", request);
    setLoading(true);
    setError(null);

    try {
      const response = await getQuestion(request);
      console.log("fetchQuestion response:", response);
      if (response.success && response.data) {
        setCurrentQuestion(response.data.question);
        setCurrentNum(response.data.current_num);
        setTotalQuestions(response.data.total_questions);
        console.log("Question set:", response.data.question);
        return response.data;
      } else {
        const errorMsg = response.error || "質問の取得に失敗しました";
        console.error("fetchQuestion error:", errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      console.error("fetchQuestion exception:", err);
      setError("質問の取得中にエラーが発生しました");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (answer: string) => {
      console.log(
        "submitAnswer called with:",
        answer,
        "currentNum:",
        currentNum
      );
      setLoading(true);
      setError(null);

      try {
        const request: AnswerRequest = {
          answer,
          current_num: currentNum - 1,
        };

        const response = await saveAnswer(request);
        console.log("submitAnswer response:", response);
        if (response.success && response.data) {
          setCurrentNum(response.data.current_num);
          return response.data;
        } else {
          const errorMsg = response.error || "回答の保存に失敗しました";
          console.error("submitAnswer error:", errorMsg);
          setError(errorMsg);
          return null;
        }
      } catch (err) {
        console.error("submitAnswer exception:", err);
        setError("回答の保存中にエラーが発生しました");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentNum]
  );

  const fetchProposal = useCallback(async () => {
    console.log("fetchProposal called");
    setLoading(true);
    setError(null);

    try {
      const response = await getProposal();
      console.log("fetchProposal response:", response);
      if (response.success && response.data) {
        return response.data;
      } else {
        const errorMsg = response.error || "提案の取得に失敗しました";
        console.error("fetchProposal error:", errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      console.error("fetchProposal exception:", err);
      setError("提案の取得中にエラーが発生しました");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessionData = useCallback(async () => {
    console.log("fetchSessionData called");
    setLoading(true);
    setError(null);

    try {
      const response = await getSessionData();
      console.log("fetchSessionData response:", response);
      if (response.success && response.data) {
        setSessionData(response.data);
        setCurrentNum(response.data.current_num);
        console.log("Session data set:", response.data);
        return response.data;
      } else {
        const errorMsg =
          response.error || "セッションデータの取得に失敗しました";
        console.error("fetchSessionData error:", errorMsg);
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      console.error("fetchSessionData exception:", err);
      setError("セッションデータの取得中にエラーが発生しました");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetQuestionSession = useCallback(async () => {
    console.log("resetQuestionSession called");
    setLoading(true);
    setError(null);

    try {
      const response = await resetSession();
      console.log("resetQuestionSession response:", response);
      if (response.success) {
        setCurrentQuestion(null);
        setCurrentNum(0);
        setSessionData(null);
        return true;
      } else {
        const errorMsg = response.error || "セッションのリセットに失敗しました";
        console.error("resetQuestionSession error:", errorMsg);
        setError(errorMsg);
        return false;
      }
    } catch (err) {
      console.error("resetQuestionSession exception:", err);
      setError("セッションのリセット中にエラーが発生しました");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
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
    clearError: () => setError(null),
  };
};
