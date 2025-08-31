"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      console.log(
        "ProtectedRoute: isLoading=",
        isLoading,
        "isAuthenticated=",
        isAuthenticated
      );

      // ローディング中は待機
      if (isLoading) {
        console.log("ProtectedRoute: Still loading, waiting...");
        return;
      }

      // 認証状態をチェック
      if (isAuthenticated) {
        console.log("ProtectedRoute: User is authenticated, allowing access");
        setIsValidating(false);
      } else {
        console.log(
          "ProtectedRoute: User is not authenticated, redirecting to login"
        );
        // リダイレクトを有効化
        setTimeout(() => {
          router.replace("/login");
        }, 100);
      }
    };

    validateToken();
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // デバッグ用：認証状態を表示
  console.log(
    "ProtectedRoute render: isAuthenticated=",
    isAuthenticated,
    "isLoading=",
    isLoading
  );

  if (!isAuthenticated) {
    return null; // リダイレクト中は何も表示しない
  }

  return <>{children}</>;
}
