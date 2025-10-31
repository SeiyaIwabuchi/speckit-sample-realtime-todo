import React from 'react';
import { TagFilter } from './TagFilter';

interface FilterBarProps {
  selectedTagIds: string[];
  onTagSelectionChange: (tagIds: string[]) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedTagIds,
  onTagSelectionChange,
}) => {
  // selectedTagIdsが空なら何も表示しない
  if (!selectedTagIds || selectedTagIds.length === 0) {
    return null;
  }
  return (
    <div className="mb-4 sm:mb-6">
      <TagFilter
        selectedTagIds={selectedTagIds}
        onSelectionChange={onTagSelectionChange}
      />
    </div>
  );
};