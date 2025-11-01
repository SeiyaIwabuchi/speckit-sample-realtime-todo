import React from 'react';
import { Todo } from '../../types/todo';
import { TodoItem } from './TodoItem';
import TodoListSkeleton from '../todos/TodoListSkeleton';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string, completed: boolean) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onUpdateTodo: (id: string, data: { title?: string; description?: string }) => Promise<void>;
  loading?: boolean;
  isFiltered?: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  loading = false,
  isFiltered = false,
}) => {
  if (loading) {
    return <TodoListSkeleton />;
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12" role="status" aria-live="polite">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-8 w-8 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          {isFiltered ? '該当するTodoがありません' : 'Todoがありません'}
        </h3>
        <p className="text-gray-500 text-sm sm:text-base">
          {isFiltered
            ? 'フィルタ条件を変更するか、すべてのフィルタをクリアしてください'
            : '新しいTodoを作成して始めましょう'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" role="list" aria-label="Todo一覧">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onUpdate={onUpdateTodo}
        />
      ))}
    </div>
  );
};