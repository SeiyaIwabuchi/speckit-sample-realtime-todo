import React from 'react';
import { useTags } from '../../hooks/useTags';

interface TagFilterProps {
  selectedTagIds: string[];
  onSelectionChange: (tagIds: string[]) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTagIds,
  onSelectionChange,
}) => {
  const { tags: allTags, loading, error } = useTags();

  const handleTagToggle = (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId);

    if (isSelected) {
      // Remove tag
      onSelectionChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      // Add tag
      onSelectionChange([...selectedTagIds, tagId]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const isTagSelected = (tagId: string) => selectedTagIds.includes(tagId);

  if (loading) {
    return (
      <div className="animate-pulse" role="status" aria-label="タグを読み込み中">
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm" role="alert">
        タグの読み込みに失敗しました
      </div>
    );
  }

  if (allTags.length === 0) {
    return null; // No tags available, don't show filter
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4" role="region" aria-labelledby="tag-filter-heading">
      <div className="flex items-center justify-between mb-3">
        <h3 id="tag-filter-heading" className="text-xs sm:text-sm font-medium text-gray-900">
          タグでフィルタ ({selectedTagIds.length} 個選択)
        </h3>
        {selectedTagIds.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
            aria-label="すべてのタグフィルタをクリア"
          >
            クリア
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1 sm:gap-2" role="group" aria-label="フィルタするタグの選択">
        {allTags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => handleTagToggle(tag.id)}
            className={`inline-flex items-center px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              isTagSelected(tag.id)
                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
            aria-pressed={isTagSelected(tag.id)}
            aria-label={`${tag.name}タグでフィルタ${isTagSelected(tag.id) ? '中' : ''}`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1 sm:mr-2 ${tag.color}`}
              aria-hidden="true"
            ></span>
            {tag.name}
            {isTagSelected(tag.id) && (
              <span className="ml-1 text-indigo-600" aria-hidden="true">×</span>
            )}
          </button>
        ))}
      </div>

      {selectedTagIds.length > 0 && (
        <div className="mt-3 text-xs sm:text-sm text-gray-500" role="status" aria-live="polite">
          選択したタグのいずれかを含むTodoが表示されます
        </div>
      )}
    </div>
  );
};