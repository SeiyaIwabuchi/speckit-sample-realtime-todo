import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoDetailView } from '../../../../src/components/todos/TodoDetailView';
import { useTags } from '../../../../src/hooks/useTags';

// Mock the useTags hook
vi.mock('../../../../src/hooks/useTags', () => ({
  useTags: vi.fn(),
}));

const mockUseTags = vi.mocked(useTags);

describe('TodoDetailView', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test description with multiple lines\nand formatting',
    completed: false,
    tagIds: ['tag1', 'tag2'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
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

  it('renders todo title', () => {
    render(<TodoDetailView todo={mockTodo} />);

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('renders todo description with formatting', () => {
    render(<TodoDetailView todo={mockTodo} />);

    const descriptionElement = screen.getByText((content, element) => {
      return content.includes('Test description with multiple lines') && content.includes('and formatting');
    });
    expect(descriptionElement).toBeInTheDocument();
  });

  it('renders creation and update dates', () => {
    render(<TodoDetailView todo={mockTodo} />);

    expect(screen.getByText(/作成日:/)).toBeInTheDocument();
    expect(screen.getByText(/更新日:/)).toBeInTheDocument();
  });

  it('renders completion status', () => {
    render(<TodoDetailView todo={mockTodo} />);

    expect(screen.getByText('未完了')).toBeInTheDocument();
  });

  it('renders completed status when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };

    render(<TodoDetailView todo={completedTodo} />);

    expect(screen.getByText('完了')).toBeInTheDocument();
  });

  it('renders associated tag badges', () => {
    render(<TodoDetailView todo={mockTodo} />);

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.queryByText('Urgent')).not.toBeInTheDocument(); // Not associated
  });

  it('shows no tags message when no tags are associated', () => {
    const todoWithoutTags = { ...mockTodo, tagIds: [] };

    render(<TodoDetailView todo={todoWithoutTags} />);

    expect(screen.getByText('タグが設定されていません')).toBeInTheDocument();
  });

  it('renders todo ID', () => {
    render(<TodoDetailView todo={mockTodo} />);

    expect(screen.getByText('ID: 1')).toBeInTheDocument();
  });

  it('does not render description section when description is empty', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined };

    render(<TodoDetailView todo={todoWithoutDescription} />);

    expect(screen.queryByText('説明')).not.toBeInTheDocument();
  });
});