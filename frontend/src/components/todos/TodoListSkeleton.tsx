import React from 'react';

/**
 * TodoListSkeleton - ローディング中に表示するスケルトンUI
 * TailwindCSSでカード型のプレースホルダーを複数表示
 */
const TodoListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4" data-testid="todo-list-skeleton">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2 border border-gray-100 dark:border-gray-700"
        >
          <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-600 rounded" />
        </div>
      ))}
    </div>
  );
};

export default TodoListSkeleton;
