import React, { useState } from 'react';
import Spinner from '../../components/ui/Spinner';
import { CreateTodoData } from '../../types/todo';
import { TagSelector } from './TagSelector';

interface CreateTodoFormProps {
  onSubmit: (data: CreateTodoData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CreateTodoForm: React.FC<CreateTodoFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

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

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        tagIds: tagIds.length > 0 ? tagIds : undefined,
      });

      // Reset form on success
      setTitle('');
      setDescription('');
      setTagIds([]);
      setErrors({});
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          タイトル *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.title ? 'border-red-500' : ''
          }`}
          placeholder="Todoのタイトルを入力"
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
            errors.description ? 'border-red-500' : ''
          }`}
          placeholder="Todoの詳細説明（任意）"
          disabled={isSubmitting}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>
        )}
      </div>

      <TagSelector
        selectedTagIds={tagIds}
        onSelectionChange={setTagIds}
        disabled={isSubmitting}
      />

      <div className="flex flex-col sm:flex-row justify-end items-stretch gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 w-full sm:w-auto"
          disabled={isSubmitting}
        >
            {isSubmitting ? (
              <span className="flex items-center">
                <Spinner size={20} className="mr-2" />作成中...
              </span>
            ) : '作成'}
        </button>
      </div>
    </form>
  );
};