/// <reference types="vitest/globals" />
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTodos } from '../../../src/hooks/useTodos';
import { TodoService } from '../../../src/services/todoService';
import { toastService } from '../../../src/services/toastService';
import { useAuthContext } from '../../../src/contexts/AuthContext';
import { vi } from 'vitest';
import { User } from '../../../src/types/user';
import { Todo } from '../../../src/types/todo';

vi.mock('../../../src/services/todoService');
vi.mock('../../../src/services/toastService');
vi.mock('../../../src/contexts/AuthContext');
vi.mock('../../../src/services/firebase', () => ({
  db: {},
  auth: {},
}));

const mockUser: User = {
  id: 'user123',
  email: 'test@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuthContext).mockReturnValue({
    user: mockUser,
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
  });
});

describe('useTodos', () => {
  it('should call createTodo and show success toast', async () => {
    const todo: Todo = {
      id: 'todo123',
      title: 'Test',
      description: 'Desc',
      completed: false,
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user123',
    };
    vi.mocked(TodoService.createTodo).mockResolvedValue(todo);
    vi.mocked(toastService.success).mockImplementation(() => {});
    const { result } = renderHook(() => useTodos());
    await act(async () => {
      await result.current.createTodo({ title: 'Test', description: 'Desc' });
    });
    expect(TodoService.createTodo).toHaveBeenCalledWith('user123', { title: 'Test', description: 'Desc' });
    expect(toastService.success).toHaveBeenCalledWith('Todoが作成されました');
  });

  it('should call updateTodo and show success toast', async () => {
    vi.mocked(TodoService.updateTodo).mockResolvedValue(undefined);
    vi.mocked(toastService.success).mockImplementation(() => {});
    const { result } = renderHook(() => useTodos());
    await act(async () => {
      await result.current.updateTodo('todo123', { title: 'Updated' });
    });
    expect(TodoService.updateTodo).toHaveBeenCalledWith('todo123', { title: 'Updated' });
    expect(toastService.success).toHaveBeenCalledWith('Todoが更新されました');
  });

  it('should call deleteTodo and show success toast', async () => {
    vi.mocked(TodoService.deleteTodo).mockResolvedValue(undefined);
    vi.mocked(toastService.success).mockImplementation(() => {});
    const { result } = renderHook(() => useTodos());
    await act(async () => {
      await result.current.deleteTodo('todo123');
    });
    expect(TodoService.deleteTodo).toHaveBeenCalledWith('todo123');
    expect(toastService.success).toHaveBeenCalledWith('Todoが削除されました');
  });

  it('should call toggleTodo and show correct toast', async () => {
    vi.mocked(TodoService.toggleTodo).mockResolvedValue(undefined);
    vi.mocked(toastService.success).mockImplementation(() => {});
    const { result } = renderHook(() => useTodos());
    await act(async () => {
      await result.current.toggleTodo('todo123', true);
    });
    expect(TodoService.toggleTodo).toHaveBeenCalledWith('todo123', true);
    expect(toastService.success).toHaveBeenCalledWith('Todoが完了しました');
    await act(async () => {
      await result.current.toggleTodo('todo123', false);
    });
    expect(toastService.success).toHaveBeenCalledWith('Todoが未完了に戻りました');
  });

  it('should handle errors and show error toast', async () => {
    const error = new Error('Test error');
    vi.mocked(TodoService.createTodo).mockRejectedValue(error);
    vi.mocked(toastService.error).mockImplementation(() => {});
    const { result } = renderHook(() => useTodos());
    await act(async () => {
      await expect(result.current.createTodo({ title: 'Test', description: 'Desc' })).rejects.toThrow('Test error');
    });
    expect(toastService.error).toHaveBeenCalled();
  });

  it('should use subscribeToTodos when no tagIds specified', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(TodoService.subscribeToTodos).mockReturnValue(mockUnsubscribe);

    renderHook(() => useTodos());

    expect(TodoService.subscribeToTodos).toHaveBeenCalledWith('user123', expect.any(Function));
    expect(TodoService.subscribeToFilteredTodos).not.toHaveBeenCalled();
  });

  it('should use subscribeToFilteredTodos when tagIds are specified', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(TodoService.subscribeToFilteredTodos).mockReturnValue(mockUnsubscribe);

    renderHook(() => useTodos({ tagIds: ['tag1', 'tag2'] }));

    expect(TodoService.subscribeToFilteredTodos).toHaveBeenCalledWith('user123', ['tag1', 'tag2'], expect.any(Function));
    expect(TodoService.subscribeToTodos).not.toHaveBeenCalled();
  });

  it('should use subscribeToTodos when tagIds is empty array', () => {
    const mockUnsubscribe = vi.fn();
    vi.mocked(TodoService.subscribeToTodos).mockReturnValue(mockUnsubscribe);

    renderHook(() => useTodos({ tagIds: [] }));

    expect(TodoService.subscribeToTodos).toHaveBeenCalledWith('user123', expect.any(Function));
    expect(TodoService.subscribeToFilteredTodos).not.toHaveBeenCalled();
  });
});
