import React from 'react';
import { Dialog } from '@headlessui/react';
import CreateTagForm from './CreateTagForm';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, color: string) => void;
};

const CreateTagModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [error, setError] = React.useState('');
  const handleSubmit = async (name: string, color: string) => {
    setError('');
    try {
      await onSubmit(name, color);
    } catch (e: any) {
      setError(e.message || 'タグ作成に失敗しました');
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="create-tag-title">
      <div className="flex items-center justify-center min-h-screen px-2">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300" />
        <Dialog.Panel className="relative bg-white rounded-xl p-8 shadow-2xl w-full max-w-md mx-auto animate-fadeIn">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none text-xl" aria-label="モーダルを閉じる">
            ×
          </button>
          <Dialog.Title id="create-tag-title" className="text-2xl font-bold mb-4 text-center">タグ作成</Dialog.Title>
          <CreateTagForm onSubmit={handleSubmit} error={error} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateTagModal;
