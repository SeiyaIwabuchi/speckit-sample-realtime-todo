import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';
import { useAuth } from '../hooks/useAuth';
import EditTagModal from './tags/EditTagModal';
import TagList from './tags/TagList';
import CreateTagForm from './tags/CreateTagForm';
import { Tag } from '../types/tag';

const TagManager: React.FC = () => {
  const { tags, createTag, updateTag, deleteTag } = useTags();
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const [createError, setCreateError] = useState('');

  const handleDelete = (tag: Tag) => {
    if (window.confirm(`「${tag.name}」タグを削除しますか？\nこの操作は元に戻せません。`)) {
      deleteTag(tag.id);
    }
  };

  const handleCreateSubmit = async (name: string, color: string) => {
    setCreateError('');
    try {
      if (user) {
        await createTag({ name, color, userId: user.id });
      }
    } catch (e: any) {
      setCreateError(e.message || 'タグ作成に失敗しました');
    }
  };

  return (
    <div className="space-y-8">
      {/* タグ追加フォーム */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">タグを追加</h2>
        <CreateTagForm onSubmit={handleCreateSubmit} error={createError} />
      </div>

      {/* タグ一覧 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">タグ一覧</h2>
        <TagList
          tags={tags}
          onEdit={tag => { setEditTag(tag); setEditOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      {/* モーダル */}
      {editTag && editOpen && (
        <EditTagModal
          open={editOpen}
          onClose={() => { setEditOpen(false); setEditTag(null); }}
          tag={editTag}
          onSubmit={async (name, color) => {
            if (user) {
              await updateTag(editTag.id, { name, color, userId: user.id });
            }
            setEditOpen(false);
            setEditTag(null);
          }}
        />
      )}
    </div>
  );
};

export default TagManager;