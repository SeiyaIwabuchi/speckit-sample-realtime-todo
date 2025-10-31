import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';
import { useAuth } from '../hooks/useAuth';
import CreateTagModal from '../components/tags/CreateTagModal';
import EditTagModal from '../components/tags/EditTagModal';
import TagList from '../components/tags/TagList';
import { Tag } from '../types/tag';

const TagManagementPage: React.FC = () => {
  const { tags, createTag, updateTag, deleteTag } = useTags();
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTag, setEditTag] = useState<Tag | null>(null);

  const handleDelete = (tag: Tag) => {
    if (window.confirm(`「${tag.name}」タグを削除しますか？\nこの操作は元に戻せません。`)) {
      deleteTag(tag.id);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8 px-2 sm:px-4">
      {/* ヘッダー */}
      <div className="text-center py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">タグ管理</h1>
        <p className="text-gray-600 text-sm sm:text-base">Todoに付与するタグを管理できます</p>
      </div>

      {/* タグ追加ボタン */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch gap-2">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 w-full sm:w-auto" onClick={() => setCreateOpen(true)} aria-label="新しいタグを追加する">
          タグを追加
        </button>
      </div>

      {/* タグ一覧カード */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">タグ一覧</h2>
        <TagList
          tags={tags}
          onEdit={tag => { setEditTag(tag); setEditOpen(true); }}
          onDelete={handleDelete}
        />
      </div>

      {/* モーダル */}
      <CreateTagModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={async (name, color) => {
          if (user) {
            await createTag({ name, color, userId: user.id });
          }
          setCreateOpen(false);
        }}
      />
      {editTag && (
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

export default TagManagementPage;
