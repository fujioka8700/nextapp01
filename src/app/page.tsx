import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { Todo } from '@prisma/client';
import Header from './components/Header';
import { auth } from '@/auth';
import TodoList from './components/TodoList';

// --- データ取得ロジック ---

/**
 * 認証ユーザーのTODOのみを取得する
 * @param userId ログインユーザーのID (string | undefined)
 * @returns 該当ユーザーのTODOリスト
 */
async function getTodos(userId?: string): Promise<Todo[]> {
  if (!userId) {
    return [];
  }

  try {
    const todos = await prisma.todo.findMany({
      where: { userId: userId },
      orderBy: { id: 'desc' },
    });
    return todos;
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
}

// --- Server Actions ---

async function createTodo(formData: FormData): Promise<void> {
  'use server';

  const session = await auth();
  if (!session?.user?.id) {
    console.error('Error: User not authenticated.');
    return;
  }

  const title = formData.get('title') as string;
  if (!title) return;

  try {
    await prisma.todo.create({
      data: {
        title: title,
        userId: session.user.id,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error creating todo:', error);
  }
}

async function deleteTodo(formData: FormData): Promise<void> {
  'use server';

  const session = await auth();
  if (!session?.user?.id) {
    console.error('Error: User not authenticated for deletion.');
    return;
  }

  const idString = formData.get('id') as string;
  const todoId = parseInt(idString, 10);
  if (isNaN(todoId)) return;

  try {
    // 認可チェック: IDとユーザーIDが一致するレコードのみを削除
    await prisma.todo.delete({
      where: {
        id: todoId,
        userId: session.user.id,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting todo or todo not found:', error);
  }
}

async function updateTodo(formData: FormData): Promise<void> {
  'use server';

  const session = await auth();
  if (!session?.user?.id) {
    console.error('Error: User not authenticated for update.');
    return;
  }

  const idString = formData.get('id') as string;
  const newTitle = formData.get('newTitle') as string;

  const todoId = parseInt(idString, 10);
  if (isNaN(todoId) || !newTitle) return;

  try {
    // 認可チェック: IDとユーザーIDが一致するレコードのみを更新
    await prisma.todo.update({
      where: {
        id: todoId,
        userId: session.user.id,
      },
      data: {
        title: newTitle,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating todo or todo not found:', error);
  }
}

// --- メインコンポーネント ---

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const todos = await getTodos(userId);
  const isLoggedIn = !!userId;

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isLoggedIn ? (
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
              className="px-4 py-2 bg-green-600 text-white border-none cursor-pointer transition hover:bg-green-700 rounded-md"
            >
              やることを追加
            </button>
          </form>
        ) : (
          <p style={{ marginBottom: '20px' }}>
            TODOを追加するにはログインが必要です。
          </p>
        )}

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h3>📖 あなたのTODOリスト</h3>
          {isLoggedIn ? (
            // Client Componentである TodoList に props を渡す
            <TodoList
              todos={todos}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
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
