'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import React from 'react';

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const userDisplayName =
    session?.user?.name || session?.user?.email || 'ユーザー';

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* 左側: ロゴエリア */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-xl font-bold">
            <span className="text-2xl font-extrabold">Todoアプリ</span>
          </Link>
        </div>

        {/* 右側: 認証ナビゲーションエリア */}
        <nav className="flex items-center space-x-6">
          {loading && (
            // ロード中の表示
            <div className="w-20 h-6 bg-blue-500 rounded animate-pulse" />
          )}

          {session && (
            // ログイン済みの場合
            <div className="flex items-center space-x-4 text-sm font-medium">
              {/* ユーザー名 */}
              <span className="truncate max-w-xs">
                ようこそ、{userDisplayName} さん
              </span>

              {/* ログアウトボタン */}
              <button
                // ログアウト後にトップページへリダイレクト
                onClick={() => signOut({ callbackUrl: '/' })}
                className="hover:text-blue-200 transition duration-150 py-1 px-2 border border-white rounded"
              >
                ログアウト
              </button>
            </div>
          )}

          {!loading && !session && (
            // ログアウト済みの場合
            <div className="text-sm font-medium">
              <Link
                href="/login"
                className="py-1 px-4 bg-white text-blue-600 font-bold rounded hover:bg-gray-100 transition duration-150"
              >
                ログイン
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
