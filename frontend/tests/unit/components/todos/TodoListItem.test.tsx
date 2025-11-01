import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoListItem } from '../../../../src/components/todos/TodoListItem';
import { useTags } from '../../../../src/hooks/useTags';

// Mock the useTags hook
vi.mock('../../../../src/hooks/useTags', () => ({
  useTags: vi.fn(),
}));

const mockUseTags = vi.mocked(useTags);

describe('TodoListItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test description',
    completed: false,
    tagIds: ['tag1', 'tag2'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    userId: 'user1',
  };

  const mockTags = [
    { id: 'tag1', name: 'Work', color: 'bg-blue-500', createdAt: new Date(), updatedAt: new Date(), userId: 'user1' },
    { id: 'tag2', name: 'Personal', color: 'bg-green-500', createdAt: new Date(), updatedAt: new Date(), userId: 'user1' },
    { id: 'tag3', name: 'Urgent', color: 'bg-red-500', createdAt: new Date(), updatedAt: new Date(), userId: 'user1' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTags.mockReturnValue({
      tags: mockTags,
      loading: false,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });
  });

  it('renders todo title and description', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders tag badges for associated tags', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.queryByText('Urgent')).not.toBeInTheDocument(); // Not associated with todo
  });

  it('does not render tag badges when no tags are associated', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const todoWithoutTags = { ...mockTodo, tagIds: [] };

    render(
      <TodoListItem
        todo={todoWithoutTags}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Work')).not.toBeInTheDocument();
    expect(screen.queryByText('Personal')).not.toBeInTheDocument();
  });

  it('renders creation date', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/作成日:/)).toBeInTheDocument();
  });

  it('renders edit and delete buttons', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('編集'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('削除'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('renders checkbox when onToggleComplete is provided', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnToggleComplete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('calls onToggleComplete when checkbox is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnToggleComplete = vi.fn();

    render(
      <TodoListItem
        todo={mockTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith('1', true);
  });

  it('shows completed styling when todo is completed', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const completedTodo = { ...mockTodo, completed: true };

    render(
      <TodoListItem
        todo={completedTodo}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const title = screen.getByText('Test Todo');
    expect(title).toHaveClass('line-through', 'text-gray-500');
  });
});