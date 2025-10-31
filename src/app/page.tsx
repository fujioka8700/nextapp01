import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { Todo } from '@prisma/client';
import Header from './components/Header';
import { auth } from '@/auth'; // 👈 認証設定をエクスポートしたファイルからのインポートを想定

/**
 * 認証ユーザーのTODOのみを取得する
 * @param userId ログインユーザーのID (string | undefined)
 * @returns 該当ユーザーのTODOリスト
 */
async function getTodos(userId?: string): Promise<Todo[]> {
  // ユーザーIDがない場合は、TODOを取得せず空の配列を返す
  if (!userId) {
    return [];
  }

  try {
    const todos = await prisma.todo.findMany({
      where: {
        // 🚀 ログインユーザーIDでフィルタリング
        userId: userId,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
}

async function createTodo(formData: FormData): Promise<void> {
  'use server';

  const session = await auth();

  if (!session?.user?.id) {
    console.error('Error: User not authenticated.');
    return;
  }

  const title = formData.get('title') as string;
  if (!title) return;

  const userId = session.user.id;

  try {
    await prisma.todo.create({
      data: {
        title: title,
        userId: userId,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.error('Error creating todo:', error);
  }
}

export default async function HomePage() {
  // 🚀 認証セッションを取得
  const session = await auth();
  const userId = session?.user?.id; // ユーザーIDを取得

  // 🚀 getTodosにユーザーIDを渡す
  const todos = await getTodos(userId);

  // フォームを表示するかどうかを決定(ログイン時のみ表示)
  const showForm = !!userId;

  // 🚀 ログイン状態を判定
  const isLoggedIn = !!userId;

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* ユーザーが認証されている場合のみフォームを表示 */}
        {showForm ? (
          <form
            action={createTodo}
            style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}
          >
            <input
              type="text"
              name="title"
              placeholder="新しいTODOを入力"
              required
              style={{ padding: '8px', flexGrow: 1, border: '1px solid #ccc' }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 15px',
                background: 'green',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              やることを追加
            </button>
          </form>
        ) : (
          // ログインしていない場合のメッセージを表示（任意）
          <p style={{ marginBottom: '20px', color: 'black' }}>
            TODOを追加するにはログインが必要です。
          </p>
        )}

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>📖 あなたのTODOリスト</h3>
          {/* 🚀 ログイン状態によって表示内容を切り替える */}
          {isLoggedIn ? (
            <ul>
              {todos.map((todo) => (
                <li key={todo.id}>
                  No.{todo.id} {todo.title}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              ログイン後、やることが表示されます
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
