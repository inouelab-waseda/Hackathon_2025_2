"use client";

import { useState } from "react";
import { signupAction, SignupData, SignupResponse } from "@/lib/actions/auth";
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

    try {
      const result: SignupResponse = await signupAction(formData);

      if (result.success) {
        setSuccess(result.message || "アカウントが正常に作成されました！");
        setFormData({ email: "", password: "", full_name: "" });

        // 2秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push("/login");
        }, 2000);

        return { success: true };
      } else {
        setError(result.error || "サインアップに失敗しました。");
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
