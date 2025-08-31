"use client";

import SignupModal from "../../components/SignupModal";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ページが読み込まれたら自動的にモーダルを開く
    setIsModalOpen(true);
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    // モーダルが閉じられたらルートページに戻る
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">サインアップ</h1>
        <p className="text-gray-600 mb-8">
          アカウントを作成して性格診断を始めましょう
        </p>
      </div>

      <SignupModal isOpen={isModalOpen} onClose={handleClose} />
    </div>
  );
}
