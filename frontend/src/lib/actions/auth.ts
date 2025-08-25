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
  } catch (error) {
    return {
      success: false,
      error: "ネットワークエラーが発生しました。",
    };
  }
}
