"use client";

import { useState } from "react";
import { signupAction, SignupData, SignupResponse } from "@/lib/actions/auth";
import { useAuth } from "@/contexts/AuthContext";
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
      const result: SignupResponse = await signupAction(formData);

      if (result.success) {
        setSuccess(result.message || "アカウントが正常に作成されました！");
        setFormData({ email: "", password: "", full_name: "" });

        // サインアップ成功時にログイン状態を設定
        const userData = {
          id: "temp-id", // バックエンドから返されるIDを使用
          email: formData.email,
          full_name: formData.full_name,
        };
        login(userData);

        // 2秒後に質問ページにリダイレクト
        setTimeout(() => {
          router.push("/question");
        }, 2000);

        return { success: true };
      } else {
        setError(result.error || "サインアップに失敗しました。");
        return { success: false };
      }
    } catch (err) {
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
