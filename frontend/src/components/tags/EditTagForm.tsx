import React, { useState } from 'react';
import Spinner from '../ui/Spinner';
import ColorPicker from './ColorPicker';
import { Tag } from '../../types/tag';

type Props = {
  tag: Tag;
  onSubmit: (name: string, color: string) => void;
  error?: string;
  isSubmitting?: boolean;
};

const EditTagForm: React.FC<Props> = ({ tag, onSubmit, error, isSubmitting = false }) => {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const [localError, setLocalError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setLocalError('タグ名は必須です');
      return;
    }
    setLocalError('');
    onSubmit(name, color);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="edit-tag-name" className="block text-sm font-medium text-gray-700 mb-1">
          タグ名
        </label>
        <input
          id="edit-tag-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-required="true"
          aria-invalid={localError ? 'true' : 'false'}
          aria-describedby={localError || error ? 'edit-tag-error' : undefined}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          色
        </label>
        <ColorPicker selectedColor={color} onChange={setColor} />
      </div>
      <div className="flex items-center justify-end">
        {isSubmitting ? (
          <Spinner size={24} color="text-blue-500" className="ml-2" aria-label="保存中" />
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
            aria-label="タグを保存"
          >
            保存
          </button>
        )}
      </div>
      {(localError || error) && (
        <div id="edit-tag-error" className="text-red-500 text-xs mt-2" role="alert" aria-live="assertive">
          {localError || error}
        </div>
      )}
    </form>
  );
};

export default EditTagForm;
