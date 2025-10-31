'use client';

import React, { useState } from 'react';
import { Todo } from '@prisma/client';

// Server Actionの型定義
type ServerAction = (formData: FormData) => Promise<void>;

interface TodoListProps {
  todos: Todo[];
  deleteTodo: ServerAction;
  updateTodo: ServerAction;
}

export default function TodoList({
  todos,
  deleteTodo,
  updateTodo,
}: TodoListProps) {
  // 🚀 編集中の入力値を管理する状態 (key: todoId, value: draftTitle)
  const [draftTitles, setDraftTitles] = useState<Record<number, string>>({});

  // フォーム送信後にデータを再ロードするロジックは、親コンポーネント（HomePage）が担当するため、
  // ここではServer Actionを呼び出すことに専念します。

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    await updateTodo(formData);

    // 更新が成功したら、draftTitlesから該当IDを削除し、ボタンを非活性化
    const idString = formData.get('id') as string;
    const todoId = parseInt(idString, 10);
    if (!isNaN(todoId)) {
      setDraftTitles((prev) => {
        const newState = { ...prev };
        delete newState[todoId];
        return newState;
      });
    }
  };

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    await deleteTodo(formData);
    // 削除後の再描画はServer ActionのrevalidatePathに依存
  };

  // 🚀 入力値変更ハンドラー
  const handleTitleChange = (todoId: number, newTitle: string) => {
    setDraftTitles((prev) => ({
      ...prev,
      [todoId]: newTitle,
    }));
  };

  if (todos.length === 0) {
    return (
      <p style={{ color: '#666', fontStyle: 'italic' }}>
        やることがありません。追加してください。
      </p>
    );
  }

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {todos.map((todo) => {
        // 🚀 現在の入力値を取得。draftsになければ元のタイトルを使用
        const currentDraft = draftTitles[todo.id] ?? todo.title;
        // 🚀 変更されたかどうかをチェック
        const isDirty =
          currentDraft !== todo.title && currentDraft.trim() !== '';

        return (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px dotted #ccc',
              gap: '10px',
            }}
          >
            <span style={{ minWidth: '30px' }}>No.{todo.id}</span>

            {/* 編集フォーム */}
            <form
              onSubmit={handleUpdate} // クライアント側でラップした関数を使用
              style={{
                display: 'flex',
                flexGrow: 1,
                gap: '5px',
                alignItems: 'center',
              }}
            >
              <input type="hidden" name="id" value={todo.id} />
              <input
                type="text"
                name="newTitle"
                value={currentDraft} // 🚀 状態から値を取得
                onChange={(e) => handleTitleChange(todo.id, e.target.value)} // 🚀 変更を状態に反映
                required
                style={{
                  padding: '5px',
                  border: '1px solid #ccc',
                  flexGrow: 1,
                }}
              />
              <button
                type="submit"
                disabled={!isDirty} // 🚀 変更がない場合に非活性化
                style={{
                  background: isDirty ? '#007bff' : '#ccc', // 活性時に青、非活性時に灰色
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: isDirty ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  minWidth: '60px',
                  transition: 'background 0.2s',
                }}
              >
                更新
              </button>
            </form>

            {/* 削除フォーム */}
            <form onSubmit={handleDelete} style={{ marginLeft: 'auto' }}>
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  minWidth: '60px',
                }}
              >
                削除
              </button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}
