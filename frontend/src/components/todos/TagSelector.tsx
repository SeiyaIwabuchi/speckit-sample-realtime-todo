import React from 'react';
import { useTags } from '../../hooks/useTags';
import { Tag } from '../../types/tag';

interface TagSelectorProps {
  selectedTagIds: string[];
  onSelectionChange: (tagIds: string[]) => void;
  maxSelection?: number;
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTagIds,
  onSelectionChange,
  maxSelection = 20,
  disabled = false,
}) => {
  const { tags, loading, error } = useTags();

  const handleTagToggle = (tagId: string) => {
    if (disabled) return;

    const isSelected = selectedTagIds.includes(tagId);

    // maxSelectionに達している場合、未選択タグは何も起こさない
    if (!isSelected && selectedTagIds.length >= maxSelection) {
      return; // 何も呼ばない
    }

    if (isSelected) {
      // Remove tag
      onSelectionChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      // Add tag
      onSelectionChange([...selectedTagIds, tagId]);
    }
  };

  const isTagSelected = (tagId: string) => selectedTagIds.includes(tagId);

  const canSelectMore = selectedTagIds.length < maxSelection;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm">
        タグの読み込みに失敗しました
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        利用可能なタグがありません。タグ管理ページで作成してください。
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        タグ ({selectedTagIds.length}/{maxSelection})
      </label>
      <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
        <div className="space-y-2">
          {tags.map((tag: Tag) => (
            <label key={tag.id} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isTagSelected(tag.id)}
                onChange={() => handleTagToggle(tag.id)}
                disabled={disabled || (!isTagSelected(tag.id) && !canSelectMore)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span
                className={`inline-block w-3 h-3 rounded-full ${tag.color}`}
                aria-hidden="true"
              ></span>
              <span className="text-xs sm:text-sm text-gray-700">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>
      {!canSelectMore && (
        <p className="mt-1 text-xs sm:text-sm text-amber-600">
          最大 {maxSelection} 個まで選択できます
        </p>
      )}
    </div>
  );
};