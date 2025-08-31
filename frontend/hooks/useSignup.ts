"use client";

import { useState } from "react";
import { signupAction, SignupData, SignupResponse } from "../lib/actions/auth";
import { useRouter } from "next/navigation";

export function useSignup() {
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    full_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // const { login } = useAuth(); // 現在は使用していないためコメントアウト
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
    const trimmedFullName = formData.full_name?.trim() || "";

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

    if (!trimmedFullName) {
      setError("名前を入力してください");
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

    // パスワードの長さチェック
    if (trimmedPassword.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setIsLoading(false);
      return { success: false };
    }

    try {
      const result: SignupResponse = await signupAction(formData);

      if (result.success) {
        setSuccess(
          "アカウントが正常に作成されました！ログインページに移動します..."
        );
        setFormData({ email: "", password: "", full_name: "" });

        // 1.5秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push("/login");
        }, 1500);

        return { success: true };
      } else {
        // エラーがオブジェクトの場合に備えて文字列に変換
        const errorMessage =
          typeof result.error === "string"
            ? result.error
            : "サインアップに失敗しました。";

        // クライアントサイドで既にチェック済みのエラーは表示しない
        if (
          !errorMessage.includes("必須項目が入力されていません") &&
          !errorMessage.includes("メールアドレスを入力してください") &&
          !errorMessage.includes("パスワードを入力してください") &&
          !errorMessage.includes("名前を入力してください") &&
          !errorMessage.includes("メールアドレスの形式が正しくありません") &&
          !errorMessage.includes("パスワードは8文字以上で入力してください")
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
    setFormData({ email: "", password: "", full_name: "" });
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
