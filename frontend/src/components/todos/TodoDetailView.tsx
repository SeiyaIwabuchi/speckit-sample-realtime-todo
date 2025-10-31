import React from 'react';
import { Todo } from '../../types/todo';
import { useTags } from '../../hooks/useTags';
import TagBadge from '../tags/TagBadge';

interface TodoDetailViewProps {
  todo: Todo;
}

export const TodoDetailView: React.FC<TodoDetailViewProps> = ({ todo }) => {
  const { tags: allTags } = useTags();

  // Filter tags that are associated with this todo
  const tags = allTags.filter(tag => todo.tagIds?.includes(tag.id));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{todo.title}</h2>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>作成日: {todo.createdAt.toLocaleDateString('ja-JP')}</span>
            {todo.updatedAt.getTime() !== todo.createdAt.getTime() && (
              <span>更新日: {todo.updatedAt.toLocaleDateString('ja-JP')}</span>
            )}
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {todo.completed ? '完了' : '未完了'}
            </span>
          </div>
        </div>

        {todo.description && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">説明</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{todo.description}</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">タグ</h3>
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagBadge key={tag.id} name={tag.name} color={tag.color} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">タグが設定されていません</p>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-gray-400">
            ID: {todo.id}
          </div>
        </div>
      </div>
    </div>
  );
};