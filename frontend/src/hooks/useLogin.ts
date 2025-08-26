"use client";

import { useState } from "react";
import { loginAction, LoginData, LoginResponse } from "@/lib/actions/auth";
import { useAuth } from "@/contexts/AuthContext";
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

    try {
      const result: LoginResponse = await loginAction(formData);

      if (result.success) {
        setSuccess(result.message || "ログインに成功しました！");
        setFormData({ email: "", password: "" });

        // ログイン成功時にユーザー状態とトークンを設定
        if (result.user && result.token) {
          login(result.user, result.token);
        }

        // 2秒後に質問ページにリダイレクト
        setTimeout(() => {
          router.push("/question");
        }, 2000);

        return { success: true };
      } else {
        setError(result.error || "ログインに失敗しました。");
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
