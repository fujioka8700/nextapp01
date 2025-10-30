// src/app/login/page.tsx

"use client" // クライアントコンポーネントとして実行

import { signIn } from "next-auth/react"
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // キャンセルボタンにLinkの代わりにrouterを使用する場合
import Image from 'next/image';

const LoginPage: React.FC = () => {
    const router = useRouter();

    // Google認証を開始するハンドラー
    const handleGoogleSignIn = () => {
        // 'google'プロバイダーで認証を開始し、成功したらトップページ ('/') へリダイレクト
        signIn('google', { callbackUrl: '/' }); 
    };

    // キャンセルボタンのハンドラー（トップページ '/' へ遷移）
    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl">
                
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    ログイン
                </h2>

                {/* Googleログインボタン */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
                >
                    <Image
                        src="/Google__G__logo.svg.png" // Googleのロゴ画像のパス
                        alt="Google Logo"
                        width={20}
                        height={20}
                        className="mr-3"
                    />
                    Googleでログイン
                </button>

                {/* キャンセルボタン (router.pushを使用) */}
                <button
                    onClick={handleCancel}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition duration-150"
                >
                    キャンセル
                </button>
                
                {/* Linkコンポーネントでキャンセルを実装する別の方法 */}
                {/*
                <Link 
                    href="/" 
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition duration-150"
                >
                    キャンセル
                </Link>
                */}

            </div>
        </div>
    );
};

export default LoginPage;