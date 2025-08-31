"use client";

import LoginModal from "../../components/LoginModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ページが読み込まれたら自動的にモーダルを開く
    setIsModalOpen(true);
  }, []);

  const handleClose = () => {
    if (isRedirecting) {
      console.log("LoginPage: Already redirecting, skipping handleClose");
      return;
    }

    setIsModalOpen(false);
    // モーダルが閉じられたらルートページに戻る
    console.log("LoginPage: handleClose called, redirecting to /");
    setIsRedirecting(true);
    router.push("/");
  };

  const handleLoginSuccess = () => {
    console.log("LoginPage: Login successful, redirecting to /question");
    setIsRedirecting(true);
    // ログイン成功時は/questionに遷移
    router.replace("/question");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">ログイン</h1>
        <p className="text-gray-600 mb-8">
          アカウントにログインして性格診断を続けましょう
        </p>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
