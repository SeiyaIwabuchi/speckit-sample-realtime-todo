import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import TodoPage from '../../../src/pages/TodoPage';
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
  GoogleAuthProvider: class {
    setCustomParameters = vi.fn();
  },
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

// Spinnerのモック
vi.mock('../../../src/components/ui/Spinner', () => ({
  default: () => React.createElement('div', { 'data-testid': 'spinner' }, 'Loading...'),
}));

// CreateTodoModalのモック
vi.mock('../../../src/components/todo/CreateTodoModal', () => ({
  default: ({ open, onClose, onSubmit, isSubmitting }: any) => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);
    
    const handleSubmit = async (e: any) => {
      e.preventDefault();
      setError(null);
      try {
        await onSubmit({ title, description: description || undefined });
        onClose();
      } catch (err: any) {
        setError(err?.message || 'Todoの作成に失敗しました');
      }
    };

    return open ? React.createElement('div', { 'data-testid': 'create-todo-modal' },
      React.createElement('form', { onSubmit: handleSubmit },
        React.createElement('div', null,
          React.createElement('label', { htmlFor: 'title' }, 'タイトル *'),
          React.createElement('input', { 
            type: 'text', 
            id: 'title', 
            'data-testid': 'title-input',
            value: title,
            onChange: (e: any) => setTitle(e.target.value),
            required: true
          })
        ),
        React.createElement('div', null,
          React.createElement('label', { htmlFor: 'description' }, '説明'),
          React.createElement('textarea', { 
            id: 'description', 
            'data-testid': 'description-input',
            rows: 3,
            value: description,
            onChange: (e: any) => setDescription(e.target.value)
          })
        ),
        React.createElement('div', null,
          React.createElement('button', { 
            type: 'button', 
            'data-testid': 'cancel-button',
            onClick: onClose 
          }, 'キャンセル'),
          React.createElement('button', { 
            type: 'submit', 
            'data-testid': 'submit-button',
            disabled: isSubmitting
          }, isSubmitting ? '作成中...' : '作成')
        )
      ),
      error && React.createElement('div', { 'data-testid': 'error-message' }, error)
    ) : null;
  },
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

    render(<MemoryRouter><TodoPage /></MemoryRouter>);

    // Act - モーダルを開く
    const createButton = screen.getByRole('button', { name: /新しいTodoを作成/i });
    fireEvent.click(createButton);

    // モーダルが開いていることを確認
    expect(screen.getByTestId('create-todo-modal')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const submitButton = screen.getByTestId('submit-button');

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

    render(<MemoryRouter><TodoPage /></MemoryRouter>);

    // Act - モーダルを開く
    const createButton = screen.getByRole('button', { name: /新しいTodoを作成/i });
    fireEvent.click(createButton);

    const titleInput = screen.getByLabelText(/タイトル/i);
    const descriptionInput = screen.getByLabelText(/説明/i);
    const submitButton = screen.getByTestId('submit-button');

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
    render(<MemoryRouter><TodoPage /></MemoryRouter>);

    // Act - モーダルを開く
    const createButton = screen.getByRole('button', { name: /新しいTodoを作成/i });
    fireEvent.click(createButton);

    const submitButton = screen.getByTestId('submit-button');
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

    render(<MemoryRouter><TodoPage /></MemoryRouter>);

    // Act - モーダルを開く
    const createButton = screen.getByRole('button', { name: /新しいTodoを作成/i });
    fireEvent.click(createButton);

    // 説明なしで作成
    const titleInput = screen.getByLabelText(/タイトル/i);
    const submitButton = screen.getByTestId('submit-button');

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
    const mockCreateTodo = vi.fn().mockResolvedValue({
      id: 'test',
      title: 'Test Todo',
      userId: 'user123',
      completed: false,
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // ローディング状態を設定
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      loading: true,
      error: null,
      createTodo: mockCreateTodo,
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      toggleTodo: vi.fn(),
      refreshTodos: vi.fn(),
    });

    render(<MemoryRouter><TodoPage /></MemoryRouter>);

    // Act - モーダルを開く
    const createButton = screen.getByRole('button', { name: /新しいTodoを作成/i });
    fireEvent.click(createButton);

    // Assert - ローディング状態が表示される
    expect(screen.getByText('作成中...')).toBeInTheDocument();
  });
});