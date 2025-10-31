import React from 'react';
import { Dialog } from '@headlessui/react';
import { CreateTodoForm } from '../todos/CreateTodoForm';
import { CreateTodoData } from '../../types/todo';

interface CreateTodoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTodoData) => Promise<void>;
  isSubmitting?: boolean;
}

const CreateTodoModal: React.FC<CreateTodoModalProps> = ({ open, onClose, onSubmit, isSubmitting = false }) => {
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: CreateTodoData) => {
    setError(null);
    try {
      await onSubmit(data);
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Todoの作成に失敗しました');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="create-todo-title">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-2">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300" aria-hidden="true" />
        <Dialog.Panel className="relative bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl w-full max-w-sm sm:max-w-md mx-auto animate-fadeIn">
          <button onClick={onClose} className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 focus:outline-none text-lg sm:text-xl" aria-label="モーダルを閉じる">
            ×
          </button>
          <Dialog.Title id="create-todo-title" className="text-xl sm:text-2xl font-bold mb-4 text-center">新しいTodoを作成</Dialog.Title>
          <CreateTodoForm onSubmit={handleSubmit} onCancel={onClose} isSubmitting={isSubmitting} />
          {error && <div className="text-red-500 text-xs mt-2 text-center" role="alert" aria-live="assertive">{error}</div>}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateTodoModal;
