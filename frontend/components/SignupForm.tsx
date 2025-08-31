"use client";

import React from "react";
import { useSignup } from "../hooks/useSignup";

export default function SignupForm() {
  const {
    formData,
    isLoading,
    error,
    success,
    handleInputChange,
    handleSubmit,
  } = useSignup();

  const onSubmit = async (e: React.FormEvent) => {
    const result = await handleSubmit(e);
    // useSignupフックで既に遷移処理が行われるため、ここでは何もしない
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          パスワード <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="パスワードを入力"
        />
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          フルネーム
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="山田 太郎"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 text-sm bg-green-50 p-3 rounded-md">
          {success}
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "登録中..." : "サインアップ"}
        </button>
      </div>
    </form>
  );
}
