import React from 'react';
import TagBadge from './TagBadge';
import { Tag } from '../../types/tag';

type Props = {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
};

const TagList: React.FC<Props> = ({ tags, onEdit, onDelete }) => (
  <div className="space-y-4">
    {tags.length === 0 ? (
      <div className="text-gray-400" role="status" aria-live="polite">タグがありません</div>
    ) : (
      <div className="space-y-4" role="list" aria-label="タグ一覧">
        {tags.map(tag => (
          <div key={tag.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow" role="listitem">
            <div className="flex items-center gap-3 min-w-0">
              <TagBadge name={tag.name} color={tag.color} />
              <span className="font-medium text-gray-900 truncate">{tag.name}</span>
              <span className={`w-4 h-4 rounded-full border ml-2 ${tag.color}`} title={tag.color} aria-hidden="true"></span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 font-medium transition-colors" onClick={() => onEdit(tag)} aria-label={`${tag.name}タグを編集`}>
                編集
              </button>
              <button className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 font-medium transition-colors" onClick={() => onDelete(tag)} aria-label={`${tag.name}タグを削除`}>
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default TagList;
