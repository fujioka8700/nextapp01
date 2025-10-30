// 1. クライアントコンポーネントとしてマーク
"use client" 

import Link from 'next/link';
// 2. Auth.jsのクライアント用フックと関数をインポート
import { useSession, signIn, signOut } from "next-auth/react";

const Header: React.FC = () => {
  // 3. useSessionフックで認証状態を取得
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* 左側: ロゴエリア */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center text-xl font-bold">
            <span className="text-2xl font-extrabold mr-1">Todoアプリ</span>
          </Link>
        </div>

        {/* 右側: ナビゲーションエリア */}
        <nav className="flex items-center space-x-6">
          
          {/* 4. 認証状態に応じた表示の切り替え */}
          {/* ロード中は簡易的な表示を出す（任意） */}
          {loading && (
             <div className="w-20 h-6 bg-blue-500 rounded animate-pulse"></div>
          )}
          
          {/* ログイン済みの場合 */}
          {session && (
            <div className="flex items-center space-x-4 text-sm font-medium">
              {/* ユーザー名を表示 */}
              <span className="truncate max-w-xs">
                ようこそ、{session.user?.name || session.user?.email || "ユーザー"} さん
              </span>
              
              {/* ログアウトボタン */}
              <button
                // signOut関数を実行。ログアウト後にトップページへリダイレクト
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="hover:text-blue-200 transition duration-150 py-1 px-2 border border-white rounded"
              >
                ログアウト
              </button>
            </div>
          )}
          
          {/* ログアウト済みの場合 */}
          {!loading && !session && (
            <div className="text-sm font-medium">
                {/* ログインボタン */}
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