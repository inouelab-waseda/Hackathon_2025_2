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
  login: (user: User, token: AuthToken, callback?: () => void) => void;
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

  const login = (userData: User, token: AuthToken, callback?: () => void) => {
    console.log("Login called with user:", userData);

    // ローカルストレージにユーザー情報とトークンを保存
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", JSON.stringify(token));

    // ユーザー状態を設定
    setUser(userData);
    console.log("Login: User state set, isAuthenticated should be true");

    // コールバックが提供されている場合は実行
    if (callback) {
      console.log("Executing login callback");
      // 状態更新を待つために少し長めのタイムアウト
      setTimeout(callback, 200);
    }
  };

  const logout = () => {
    console.log("AuthContext: Logout called");
    setUser(null);
    // ローカルストレージからユーザー情報とトークンを削除
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // ルートページにリダイレクト
    console.log("AuthContext: Redirecting to / after logout");
    router.replace("/");
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
      console.log("checkAuth: Starting authentication check");
      // ローカルストレージからユーザー情報とトークンを取得
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      console.log("checkAuth: storedUser exists:", !!storedUser);
      console.log("checkAuth: storedToken exists:", !!storedToken);

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);
        const tokenData = JSON.parse(storedToken);

        console.log("checkAuth: Current user state:", user);
        console.log("checkAuth: Stored user data:", userData);

        // ローカルストレージのデータを直接使用して認証状態を設定
        setUser(userData);
        console.log("checkAuth: User state set from localStorage");
        return true;
      }

      console.log("checkAuth: No stored user/token found");
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
      console.log("AuthContext: Initializing authentication");

      // ローカルストレージから直接データを読み込み
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      console.log("AuthContext: storedUser exists:", !!storedUser);
      console.log("AuthContext: storedToken exists:", !!storedToken);

      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("AuthContext: Setting user from localStorage:", userData);
          setUser(userData);
        } catch (error) {
          console.error("AuthContext: Error parsing stored user:", error);
        }
      }

      console.log("AuthContext: Setting isLoading to false");
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 認証状態の変化を監視
  useEffect(() => {
    console.log("AuthContext: User state changed:", user);
    console.log("AuthContext: isAuthenticated:", isAuthenticated);
    console.log("AuthContext: isLoading:", isLoading);
  }, [user, isAuthenticated, isLoading]);

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
