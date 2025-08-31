// 環境に応じてAPI URLを決定
const getApiBaseUrl = (): string => {
  // ブラウザ環境では常にlocalhostを使用
  if (typeof window !== "undefined") {
    return "http://localhost:8000";
  }

  // サーバーサイド（SSR）では環境変数を使用
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// 認証トークンを取得する関数
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      const token = JSON.parse(tokenData);
      return token.access_token;
    }
    return null;
  } catch (error) {
    console.error("トークン取得エラー:", error);
    return null;
  }
};

// 認証ヘッダーを取得する関数
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// 認証エラー時の処理
const handleAuthError = () => {
  if (typeof window !== "undefined") {
    // ローカルストレージをクリア
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // ログインページにリダイレクト
    window.location.href = "/login";
  }
};

// 汎用APIリクエスト関数
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getAuthHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // 認証エラーの場合
      if (response.status === 401) {
        console.log("認証エラーが発生しました。ログアウト処理を実行します。");
        handleAuthError();
        return {
          success: false,
          error: "認証が必要です。再度ログインしてください。",
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("APIリクエストエラー:", error);
    return {
      success: false,
      error: "ネットワークエラーが発生しました。",
    };
  }
}

// GETリクエスト
export async function apiGet<T = unknown>(
  endpoint: string
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "GET" });
}

// POSTリクエスト
export async function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// PUTリクエスト
export async function apiPut<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

// DELETEリクエスト
export async function apiDelete<T = unknown>(
  endpoint: string
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "DELETE" });
}

// 質問関連の型定義
export interface QuestionRequest {
  current_num: number;
  num_questions: number;
}

export interface QuestionResponse {
  question: string;
  current_num: number;
  total_questions: number;
}

export interface AnswerRequest {
  answer: string;
  current_num: number;
}

export interface AnswerResponse {
  message: string;
  current_num: number;
}

export interface ProposalResponse {
  proposal: string;
}

export interface SessionData {
  questions: string[];
  answers: string[];
  current_num: number;
}

// 質問関連のAPI関数
export async function getQuestion(
  request: QuestionRequest
): Promise<ApiResponse<QuestionResponse>> {
  return apiPost<QuestionResponse>("/api/questions", request);
}

export async function saveAnswer(
  request: AnswerRequest
): Promise<ApiResponse<AnswerResponse>> {
  return apiPost<AnswerResponse>("/api/questions/answer", request);
}

export async function getProposal(): Promise<ApiResponse<ProposalResponse>> {
  return apiPost<ProposalResponse>("/api/questions/proposal", {});
}

export async function getSessionData(): Promise<ApiResponse<SessionData>> {
  return apiGet<SessionData>("/api/questions/session");
}

export async function resetSession(): Promise<
  ApiResponse<{ message: string }>
> {
  return apiPost<{ message: string }>("/api/questions/reset", {});
}
