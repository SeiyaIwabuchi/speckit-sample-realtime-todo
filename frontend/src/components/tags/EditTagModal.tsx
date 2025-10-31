import React from 'react';
import { Dialog } from '@headlessui/react';
import EditTagForm from './EditTagForm';
import { Tag } from '../../types/tag';

type Props = {
  open: boolean;
  onClose: () => void;
  tag: Tag;
  onSubmit: (name: string, color: string) => void;
};

const EditTagModal: React.FC<Props> = ({ open, onClose, tag, onSubmit }) => {
  const [error, setError] = React.useState('');
  const handleSubmit = async (name: string, color: string) => {
    setError('');
    try {
      await onSubmit(name, color);
    } catch (e: any) {
      setError(e.message || 'タグ編集に失敗しました');
      throw e;
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="edit-tag-title">
      <div className="flex items-center justify-center min-h-screen px-2">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300" />
        <Dialog.Panel className="relative bg-white rounded-xl p-8 shadow-2xl w-full max-w-md mx-auto animate-fadeIn">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none text-xl" aria-label="モーダルを閉じる">
            ×
          </button>
          <Dialog.Title id="edit-tag-title" className="text-2xl font-bold mb-4 text-center">タグ編集</Dialog.Title>
          <EditTagForm tag={tag} onSubmit={handleSubmit} error={error} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditTagModal;
