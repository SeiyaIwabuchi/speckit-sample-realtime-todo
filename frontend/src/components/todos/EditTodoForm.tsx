import React, { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner';
import { Todo, UpdateTodoData } from '../../types/todo';
import { TagSelector } from './TagSelector';

interface EditTodoFormProps {
  todo: Todo;
  onSubmit: (data: UpdateTodoData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EditTodoForm: React.FC<EditTodoFormProps> = ({
  todo,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [tagIds, setTagIds] = useState<string[]>(todo.tagIds || []);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  // Update form when todo prop changes
  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setTagIds(todo.tagIds || []);
  }, [todo]);

  const validate = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (title.trim().length < 1 || title.length > 100) {
      newErrors.title = 'タイトルは1-100文字で入力してください';
    }

    if (description.length > 1000) {
      newErrors.description = '説明は1000文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const updates: UpdateTodoData = {};

    if (title.trim() !== todo.title) {
      updates.title = title.trim();
    }

    if (description.trim() !== (todo.description || '')) {
      updates.description = description.trim() || undefined;
    }

    // Always include tagIds to handle additions/removals
    updates.tagIds = tagIds;

    // Only submit if there are changes
    if (Object.keys(updates).length === 0) {
      onCancel();
      return;
    }

    try {
      await onSubmit(updates);
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
          タイトル *
        </label>
        <input
          type="text"
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.title ? 'border-red-500' : ''
          }`}
          placeholder="Todoのタイトルを入力"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.description ? 'border-red-500' : ''
          }`}
          placeholder="Todoの詳細説明（任意）"
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <TagSelector
        selectedTagIds={tagIds}
        onSelectionChange={setTagIds}
        disabled={isSubmitting}
      />

      <div className="flex justify-end space-x-3">
        {isSubmitting ? (
          <div className="w-full flex justify-center py-2">
            <Spinner size={28} color="text-indigo-500" />
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              更新
            </button>
          </>
        )}
      </div>
    </form>
  );
};