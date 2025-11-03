'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

const LoginPage: React.FC = () => {
  const router = useRouter();

  // Google認証を開始するハンドラー
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  // キャンセルボタンのハンドラー（トップページ '/' へ遷移）
  const handleCancel = () => {
    router.push('/');
  };

  return (
    // ⬇️ 修正箇所: 垂直方向の中央揃え (items-center) を削除し、上部にパディング (pt-20) を追加
    <div className="flex justify-center min-h-screen pt-20">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl h-fit">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          ログイン
        </h2>

        {/* Googleログインボタン */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        >
          <Image
            src="/Google__G__logo.svg.png"
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-3"
          />
          Googleでログイン
        </button>

        {/* キャンセルボタン */}
        <button
          onClick={handleCancel}
          className="w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition duration-150"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
