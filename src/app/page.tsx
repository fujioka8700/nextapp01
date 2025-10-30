import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { Todo } from '@prisma/client'; // Prismaが生成したTodoモデルの型をインポート
import Header from './components/Header';

export default async function HomePage() {
  // サーバーサイドでデータベースからTodoリストを取得
  const todos: Todo[] = await prisma.todo.findMany({
    orderBy: { id: 'asc' },
  });

  // 新しいTodoを追加するサーバーアクション
  async function addTodo(data: FormData) {
    'use server';
    const title = data.get('title')?.toString() || '';
    if (title) {
      await prisma.todo.create({ data: { title } });
      revalidatePath('/'); // ホームページを再検証して最新のTodoリストを表示
    }
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Todoリスト</h1>

        {/* Todo追加フォーム */}
        <form action={addTodo} className="mb-6">
          <input
            type="text"
            name="title"
            placeholder="新しいTodoを追加"
            className="border border-gray-300 rounded-lg px-4 py-2 mr-4 w-2/3"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            追加
          </button>
        </form>

        {/* Todoリスト表示 */}
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id} className="border-b pb-2">
              {todo.title}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
} 