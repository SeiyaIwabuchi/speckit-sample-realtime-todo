export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

class ToastService {
  private listeners: ((toasts: ToastMessage[]) => void)[] = [];
  private toasts: ToastMessage[] = [];
  private nextId = 1;

  subscribe(listener: (toasts: ToastMessage[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  show(message: Omit<ToastMessage, 'id'>) {
    const toast: ToastMessage = {
      id: String(this.nextId++),
      duration: 5000,
      ...message,
    };

    this.toasts.push(toast);
    this.notify();

    // 自動削除
    setTimeout(() => {
      this.remove(toast.id);
    }, toast.duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  success(message: string, duration?: number) {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number) {
    this.show({ type: 'error', message, duration });
  }

  warning(message: string, duration?: number) {
    this.show({ type: 'warning', message, duration });
  }

  info(message: string, duration?: number) {
    this.show({ type: 'info', message, duration });
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastService = new ToastService();