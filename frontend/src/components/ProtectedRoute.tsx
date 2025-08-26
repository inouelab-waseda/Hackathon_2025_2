"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!isLoading && isAuthenticated) {
        setIsValidating(true);
        try {
          // JWTトークンの有効性をチェック
          const response = await apiGet("/api/auth/me");
          if (!response.success) {
            // トークンが無効な場合はログアウト
            logout();
            router.push("/login");
          }
        } catch (error) {
          console.error("トークン検証エラー:", error);
          logout();
          router.push("/login");
        } finally {
          setIsValidating(false);
        }
      } else if (!isLoading && !isAuthenticated) {
        router.push("/login");
      }
    };

    validateToken();
  }, [isAuthenticated, isLoading, logout, router]);

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

  if (!isAuthenticated) {
    return null; // リダイレクト中は何も表示しない
  }

  return <>{children}</>;
}
