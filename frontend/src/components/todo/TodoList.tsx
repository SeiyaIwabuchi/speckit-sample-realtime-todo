import React from 'react';
import { Todo } from '../../types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string, completed: boolean) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onUpdateTodo: (id: string, data: { title?: string; description?: string }) => Promise<void>;
  loading?: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Todoがありません</h3>
        <p className="text-gray-500">新しいTodoを作成して始めましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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