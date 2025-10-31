import React, { useState } from 'react';
import { TagSelector } from '../todos/TagSelector';
import { CreateTodoData } from '../../types/todo';

interface TodoFormProps {
  onSubmit: (data: CreateTodoData) => Promise<void>;
  loading?: boolean;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null); // エラーをリセット
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      });

      // フォームをリセット
      setTitle('');
      setDescription('');
      setTagIds([]);
    } catch (error) {
      // エラーメッセージを表示
      setError(error instanceof Error ? error.message : 'Todoの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = loading || isSubmitting || !title.trim();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">新しいTodoを作成</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Todoのタイトルを入力してください"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            説明 <span className="text-gray-500">(オプション)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Todoの詳細な説明を入力してください"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* タグ選択欄 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タグ <span className="text-gray-500">(最大20個)</span></label>
          <TagSelector
            selectedTagIds={tagIds}
            onSelectionChange={setTagIds}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-stretch gap-2">
          <button
            type="submit"
            disabled={isDisabled}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                作成中...
              </span>
            ) : (
              '作成'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};