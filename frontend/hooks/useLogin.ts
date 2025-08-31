"use client";

import { useState } from "react";
import { loginAction, LoginData, LoginResponse } from "../lib/actions/auth";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export function useLogin() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // クライアントサイドのバリデーション
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail) {
      setError("メールアドレスを入力してください");
      setIsLoading(false);
      return { success: false };
    }

    if (!trimmedPassword) {
      setError("パスワードを入力してください");
      setIsLoading(false);
      return { success: false };
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("メールアドレスの形式が正しくありません");
      setIsLoading(false);
      return { success: false };
    }

    try {
      const result: LoginResponse = await loginAction(formData);

      if (result.success) {
        setSuccess(result.message || "ログインに成功しました！");
        setFormData({ email: "", password: "" });

        // ログイン成功時にユーザー状態とトークンを設定
        if (result.user && result.token) {
          console.log("Login successful, setting user state");
          login(result.user, result.token, () => {
            // 認証状態が更新された後に遷移
            console.log("Login callback executed, navigating to /question");
            // ログインページから呼ばれている場合は、ログインページのonSuccessが処理する
            // それ以外の場合は直接遷移
            if (window.location.pathname === "/login") {
              console.log(
                "Login page detected, letting page handle navigation"
              );
            } else {
              router.replace("/question");
            }
          });
        } else {
          // ユーザー情報が取得できない場合は直接遷移
          console.log("No user data received, navigating to /question");
          if (window.location.pathname !== "/login") {
            router.replace("/question");
          }
        }

        return { success: true };
      } else {
        // エラーがオブジェクトの場合に備えて文字列に変換
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : "ログインに失敗しました。";

        // クライアントサイドで既にチェック済みのエラーは表示しない
        if (
          !errorMessage.includes("必須項目が入力されていません") &&
          !errorMessage.includes("メールアドレスを入力してください") &&
          !errorMessage.includes("パスワードを入力してください") &&
          !errorMessage.includes("メールアドレスの形式が正しくありません")
        ) {
          setError(errorMessage);
        }
        return { success: false };
      }
    } catch {
      setError("予期しないエラーが発生しました。");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setError("");
    setSuccess("");
  };

  return {
    formData,
    isLoading,
    error,
    success,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
}
