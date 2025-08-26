"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface AuthToken {
  access_token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: AuthToken) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const login = (userData: User, token: AuthToken) => {
    setUser(userData);
    // ローカルストレージにユーザー情報とトークンを保存
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", JSON.stringify(token));
  };

  const logout = () => {
    setUser(null);
    // ローカルストレージからユーザー情報とトークンを削除
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // ルートページにリダイレクト
    router.push("/");
  };

  const getAuthToken = (): string | null => {
    try {
      const tokenData = localStorage.getItem("token");
      if (tokenData) {
        const token: AuthToken = JSON.parse(tokenData);
        return token.access_token;
      }
      return null;
    } catch (error) {
      console.error("トークン取得エラー:", error);
      return null;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      // ローカルストレージからユーザー情報とトークンを取得
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        const tokenData = JSON.parse(storedToken);

        // JWTトークンの有効性をチェック
        const response = await fetch(
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

        if (response.ok) {
          setUser(userData);
          return true;
        } else {
          // トークンが無効な場合はローカルストレージをクリア
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("認証チェックエラー:", error);
      // エラーが発生した場合はローカルストレージをクリア
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    getAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
