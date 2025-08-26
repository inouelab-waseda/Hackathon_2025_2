"use server";

export interface SignupData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
  token?: {
    access_token: string;
    token_type: string;
  };
}

export async function signupAction(data: SignupData): Promise<SignupResponse> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      return {
        success: true,
        message: "アカウントが正常に作成されました！",
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "サインアップに失敗しました。",
      };
    }
  } catch {
    return {
      success: false,
      error: "ネットワークエラーが発生しました。",
    };
  }
}

export async function loginAction(data: LoginData): Promise<LoginResponse> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/api/auth/login/json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      const tokenData = await response.json();

      // ユーザー情報を取得
      const userResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/api/auth/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        return {
          success: true,
          message: "ログインに成功しました！",
          user: userData,
          token: tokenData,
        };
      } else {
        return {
          success: true,
          message: "ログインに成功しました！",
          token: tokenData,
        };
      }
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "ログインに失敗しました。",
      };
    }
  } catch {
    return {
      success: false,
      error: "ネットワークエラーが発生しました。",
    };
  }
}
