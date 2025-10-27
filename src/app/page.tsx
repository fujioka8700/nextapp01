import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { Todo } from '@prisma/client'; // Prismaが生成したTodoモデルの型をインポート

// Next.js Server Action
// Server ActionsはTypeScriptでも動作します。
async function createTodo(formData: FormData) {
  'use server';

  // FormDataから値を取得
  const title = formData.get('title') as string;

  if (!title) {
    return;
  }

  try {
    await prisma.todo.create({
      data: {
        title: title,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.error('Error creating todo:', error);
  }
}

// データの読み込み関数
// 戻り値の型をTodo[]として明示的に指定
async function getTodos(): Promise<Todo[]> {
  try {
    const todos = await prisma.todo.findMany({
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

// Next.jsのページコンポーネント (Server Component)
export default async function HomePage() {
  const todos = await getTodos();

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Next.js & PostgreSQL (Prisma) サンプル</h1>

      {/* データの書き込みフォーム (Server Action を使用) */}
      <form action={createTodo} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          name="title"
          placeholder="新しいTODOを入力"
          required
          style={{ padding: '8px', flexGrow: 1, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 15px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Prismaで追加
        </button>
      </form>

      <hr />

      <h2>TODOリスト</h2>
      {/* データの読み込み結果の表示 */}
      {todos.length === 0 ? (
        <p>TODOはまだありません。上記フォームから追加してください。</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {/* todos配列はTodo型として認識されている */}
          {todos.map((todo: Todo) => (
            <li key={todo.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
              ID: {todo.id} - {todo.title}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}