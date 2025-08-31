"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-layout min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link
                  href="/question"
                  className="flex items-center space-x-2 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <span className="text-white font-bold text-lg">✨</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300">
                    自分磨きアキネーター
                  </span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-white/30">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.full_name
                          ? user.full_name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">ようこそ</span>
                      <span className="text-sm font-medium text-gray-700">
                        {user.full_name || user.email}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white/60 backdrop-blur-sm rounded-lg transition-all duration-300 border border-transparent hover:border-white/30 shadow-sm hover:shadow-md"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="relative">
          {/* 装飾的な背景要素 */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"></div>
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
