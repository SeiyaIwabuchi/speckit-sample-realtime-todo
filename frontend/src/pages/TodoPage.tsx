import React from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoList } from '../components/todo/TodoList';
import { TodoForm } from '../components/todo/TodoForm';
import { MainLayout } from '../components/layout/MainLayout';
import { Todo } from '../types/todo';

export const TodoPage: React.FC = () => {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  } = useTodos();

  const handleCreateTodo = async (data: { title: string; description?: string }) => {
    await createTodo(data);
  };

  const handleUpdateTodo = async (id: string, data: { title?: string; description?: string }) => {
    await updateTodo(id, data);
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await toggleTodo(id, completed);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo管理</h1>
          <p className="text-gray-600">リアルタイムで同期されるTodoリスト</p>
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 新しいTodo作成フォーム */}
        <TodoForm onSubmit={handleCreateTodo} loading={loading} />

        {/* Todo統計 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              総数: <span className="font-semibold text-gray-900">{todos.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              完了: <span className="font-semibold text-green-600">{todos.filter((t: Todo) => t.completed).length}</span>
            </div>
            <div className="text-sm text-gray-600">
              未完了: <span className="font-semibold text-orange-600">{todos.filter((t: Todo) => !t.completed).length}</span>
            </div>
          </div>
        </div>

        {/* Todo一覧 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Todo一覧</h2>
          <TodoList
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onUpdateTodo={handleUpdateTodo}
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
};