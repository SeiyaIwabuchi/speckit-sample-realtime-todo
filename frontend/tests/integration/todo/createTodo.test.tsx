import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoPage } from '../../../src/pages/TodoPage';
import { TodoService } from '../../../src/services/todoService';
import { useTodos } from '../../../src/hooks/useTodos';

// Firebase Authのモック
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // 認証済みユーザーをモック
    callback({
      uid: 'user123',
      email: 'test@example.com',
    });
    return vi.fn(); // unsubscribe function
  }),
}));

// useTodosフックのモック
vi.mock('../../../src/hooks/useTodos', () => ({
  useTodos: vi.fn(() => ({
    todos: [],
    loading: false,
    error: null,
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodo: vi.fn(),
  })),
}));

// MainLayoutのモック
vi.mock('../../../src/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// TodoListのモック
vi.mock('../../../src/components/todo/TodoList', () => ({
  TodoList: () => <div>TodoList Component</div>,
}));

describe('CreateTodo Integration', () => {
  const mockCreateTodo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      loading: false,
      error: null,
      createTodo: mockCreateTodo,
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      toggleTodo: vi.fn(),
      refreshTodos: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create todo successfully when form is submitted with valid data', async () => {
    // Arrange
    const mockTodo = {
      id: 'todo123',
      title: 'Test Todo',
      description: 'Test Description',
      userId: 'user123',
      completed: false,
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCreateTodo.mockResolvedValue(mockTodo);

    render(<TodoPage />);

    // Act
    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const submitButton = screen.getByRole('button', { name: /作成/i });

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
      });
    });
  });

  it('should show error when todo creation fails', async () => {
    // Arrange
    const error = new Error('Creation failed');
    mockCreateTodo.mockRejectedValue(error);

    render(<TodoPage />);

    // Act
    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const submitButton = screen.getByRole('button', { name: /作成/i });

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
      });
    });

    // エラーメッセージが表示されることを確認
    expect(screen.getByText('Creation failed')).toBeInTheDocument();
  });

  it('should validate required title field', async () => {
    // Arrange
    render(<TodoPage />);

    // Act
    const submitButton = screen.getByRole('button', { name: /作成/i });
    fireEvent.click(submitButton);

    // Assert
    expect(mockCreateTodo).not.toHaveBeenCalled();

    // HTML5 validation should prevent submission
    const titleInput = screen.getByLabelText(/タイトル/i);
    expect(titleInput).toBeRequired();
  });

  it('should handle optional description field', async () => {
    // Arrange
    const mockTodo = {
      id: 'todo123',
      title: 'Test Todo',
      userId: 'user123',
      completed: false,
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockCreateTodo.mockResolvedValue(mockTodo);

    render(<TodoPage />);

    // Act - 説明なしで作成
    const titleInput = screen.getByLabelText(/タイトル/i);
    const submitButton = screen.getByRole('button', { name: /作成/i });

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: undefined,
      });
    });
  });

  it('should show loading state during submission', async () => {
    // Arrange
    const mockCreateTodo = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      loading: false,
      error: null,
      createTodo: mockCreateTodo,
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      toggleTodo: vi.fn(),
      refreshTodos: vi.fn(),
    });

    render(<TodoPage />);

    // Act
    const titleInput = screen.getByLabelText(/タイトル/i);
    const submitButton = screen.getByRole('button', { name: /作成/i });

    fireEvent.change(titleInput, { target: { value: 'Test Todo' } });
    fireEvent.click(submitButton);

    // Assert - ローディング状態が表示される
    expect(screen.getByText('作成中...')).toBeInTheDocument();

    // 完了まで待つ
    await waitFor(() => {
      expect(mockCreateTodo).toHaveBeenCalled();
    });
  });
});