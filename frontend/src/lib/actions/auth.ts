"use server";

// エラーメッセージを日本語に変換する関数
function translateErrorMessage(errorMsg: string): string {
  const errorMap: Record<string, string> = {
    "field required": "必須項目が入力されていません",
    "field required.": "必須項目が入力されていません",
    "Field required": "必須項目が入力されていません",
    "Field required.": "必須項目が入力されていません",
    email: "メールアドレスが正しくありません",
    password: "パスワードが正しくありません",
    full_name: "名前が正しくありません",
    "Invalid email format": "メールアドレスの形式が正しくありません",
    "Password too short": "パスワードが短すぎます",
    "Password must be at least 8 characters":
      "パスワードは8文字以上で入力してください",
    "User already exists": "このメールアドレスは既に登録されています",
    "Invalid credentials": "メールアドレスまたはパスワードが正しくありません",
    "Incorrect email or password":
      "メールアドレスまたはパスワードが正しくありません",
    "Could not validate credentials":
      "メールアドレスまたはパスワードが正しくありません",
  };

  // エラーメッセージを小文字に変換してマッチング
  const lowerErrorMsg = errorMsg.toLowerCase();

  for (const [key, value] of Object.entries(errorMap)) {
    if (lowerErrorMsg.includes(key.toLowerCase())) {
      return value;
    }
  }

  // フィールド名を含むエラーの場合
  if (lowerErrorMsg.includes("field required")) {
    return "必須項目が入力されていません";
  }

  return errorMsg;
}

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
    const url = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/api/auth/register/json`;

    console.log("Signup POST request to:", url);
    // full_nameが空文字列の場合はnullに変換
    const requestData = {
      ...data,
      full_name: data.full_name?.trim() || null,
    };
    console.log("Request data:", requestData);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      console.log("Signup successful");
      return {
        success: true,
        message: "アカウントが正常に作成されました！",
      };
    } else {
      const errorData = await response.json();
      console.log("Signup error response:", errorData);

      // エラーオブジェクトを文字列に変換
      let errorMessage = "サインアップに失敗しました。";

      if (errorData.detail) {
        if (typeof errorData.detail === "string") {
          errorMessage = translateErrorMessage(errorData.detail);
        } else if (Array.isArray(errorData.detail)) {
          // バリデーションエラーの配列の場合
          errorMessage = errorData.detail
            .map((err: unknown) => {
              const errMsg =
                typeof err === "string"
                  ? err
                  : (err as { msg?: string })?.msg || "エラーが発生しました";
              return translateErrorMessage(errMsg);
            })
            .join(", ");
        } else if (typeof errorData.detail === "object") {
          // エラーオブジェクトの場合
          const errMsg =
            errorData.detail.msg ||
            errorData.detail.message ||
            "エラーが発生しました";
          errorMessage = translateErrorMessage(errMsg);
        }
      }

      return {
        success: false,
        error: errorMessage,
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
    const url = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/api/auth/login/json`;

    console.log("Login POST request to:", url);
    console.log("Request data:", { email: data.email, password: "[HIDDEN]" });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const tokenData = await response.json();
      console.log("Login successful, token received");

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
      console.log("Login error response:", errorData);

      // エラーオブジェクトを文字列に変換
      let errorMessage = "ログインに失敗しました。";

      if (errorData.detail) {
        if (typeof errorData.detail === "string") {
          errorMessage = translateErrorMessage(errorData.detail);
        } else if (Array.isArray(errorData.detail)) {
          // バリデーションエラーの配列の場合
          errorMessage = errorData.detail
            .map((err: unknown) => {
              const errMsg =
                typeof err === "string"
                  ? err
                  : (err as { msg?: string })?.msg || "エラーが発生しました";
              return translateErrorMessage(errMsg);
            })
            .join(", ");
        } else if (typeof errorData.detail === "object") {
          // エラーオブジェクトの場合
          const errMsg =
            errorData.detail.msg ||
            errorData.detail.message ||
            "エラーが発生しました";
          errorMessage = translateErrorMessage(errMsg);
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch {
    return {
      success: false,
      error: "ネットワークエラーが発生しました。",
    };
  }
}
