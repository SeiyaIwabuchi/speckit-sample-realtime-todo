import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from '../../../../src/components/todo/TodoList';

describe('TodoList', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Description 1',
      completed: false,
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
    {
      id: '2',
      title: 'Test Todo 2',
      description: 'Description 2',
      completed: true,
      tagIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user1',
    },
  ];

  const mockProps = {
    todos: mockTodos,
    onToggleTodo: vi.fn(),
    onDeleteTodo: vi.fn(),
    onUpdateTodo: vi.fn(),
    loading: false,
  };

  it('renders todos when provided', () => {
    render(<TodoList {...mockProps} />);

    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<TodoList {...mockProps} loading={true} />);

    // Should show skeleton loading
    expect(screen.queryByText('Test Todo 1')).not.toBeInTheDocument();
  });

  it('renders empty state when no todos and not filtered', () => {
    render(
      <TodoList
        {...mockProps}
        todos={[]}
        isFiltered={false}
      />
    );

    expect(screen.getByText('Todoがありません')).toBeInTheDocument();
    expect(screen.getByText('新しいTodoを作成して始めましょう')).toBeInTheDocument();
  });

  it('renders filtered empty state when no todos and filtered', () => {
    render(
      <TodoList
        {...mockProps}
        todos={[]}
        isFiltered={true}
      />
    );

    expect(screen.getByText('該当するTodoがありません')).toBeInTheDocument();
    expect(screen.getByText('フィルタ条件を変更するか、すべてのフィルタをクリアしてください')).toBeInTheDocument();
  });
});