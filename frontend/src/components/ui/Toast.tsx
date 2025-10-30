import React, { useState, useEffect } from 'react';
import { toastService, ToastMessage } from '../../services/toastService';

export const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = toastService.subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getToastStyles = (type: ToastMessage['type']) => {
    const baseStyles = 'px-4 py-3 rounded-md shadow-lg mb-2 flex items-center justify-between';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-black`;
      case 'info':
        return `${baseStyles} bg-blue-500 text-white`;
      default:
        return `${baseStyles} bg-gray-500 text-white`;
    }
  };

  const removeToast = (id: string) => {
    toastService.remove(id);
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={getToastStyles(toast.type)}>
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};