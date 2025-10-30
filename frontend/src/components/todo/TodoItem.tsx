import React, { useState } from 'react';
import { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { title?: string; description?: string }) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    try {
      await onToggle(todo.id, !todo.completed);
    } catch (error) {
      // エラーは親コンポーネントで処理される
    }
  };

  const handleDelete = async () => {
    if (window.confirm('このTodoを削除しますか？')) {
      try {
        await onDelete(todo.id);
      } catch (error) {
        // エラーは親コンポーネントで処理される
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    setIsUpdating(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      // エラーは親コンポーネントで処理される
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 transition-all duration-200 ${
      todo.completed ? 'opacity-75 border-gray-200' : 'border-gray-300 hover:shadow-md'
    }`}>
      <div className="flex items-start space-x-3">
        {/* チェックボックス */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-colors duration-200 ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500'
          }`}
          aria-label={todo.completed ? '完了を解除' : '完了にする'}
        >
          {todo.completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Todo内容 */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Todoのタイトル"
                disabled={isUpdating}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="説明（オプション）"
                rows={2}
                disabled={isUpdating}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isUpdating || !editTitle.trim()}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? '保存中...' : '保存'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`font-medium ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-1 text-sm ${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                }`}>
                  {todo.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                作成日: {todo.createdAt.toLocaleDateString('ja-JP')}
                {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
                  <span className="ml-2">
                    更新日: {todo.updatedAt.toLocaleDateString('ja-JP')}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        {!isEditing && (
          <div className="flex-shrink-0 flex space-x-1">
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
              aria-label="編集"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
              aria-label="削除"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};