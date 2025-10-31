import React from 'react';
import { Todo } from '../../types/todo';
import { useTags } from '../../hooks/useTags';
import TagBadge from '../tags/TagBadge';

interface TodoListItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
  onToggleComplete?: (todoId: string, completed: boolean) => void;
  onRemoveTag?: (todoId: string, tagId: string) => void;
}

export const TodoListItem: React.FC<TodoListItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggleComplete,
  onRemoveTag,
}) => {
  const { tags: allTags } = useTags();

  // Filter tags that are associated with this todo
  const tags = allTags.filter(tag => todo.tagIds?.includes(tag.id));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            {onToggleComplete && (
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => onToggleComplete(todo.id, e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            )}
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>
          </div>

          {todo.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {todo.description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <div key={tag.id} className="relative">
                  <TagBadge name={tag.name} color={tag.color} />
                  {onRemoveTag && (
                    <button
                      onClick={() => onRemoveTag(todo.id, tag.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center hover:bg-red-600"
                      title={`タグ "${tag.name}" を削除`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 text-xs text-gray-500">
            作成日: {todo.createdAt.toLocaleDateString('ja-JP')}
            {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
              <> • 更新日: {todo.updatedAt.toLocaleDateString('ja-JP')}</>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(todo)}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};