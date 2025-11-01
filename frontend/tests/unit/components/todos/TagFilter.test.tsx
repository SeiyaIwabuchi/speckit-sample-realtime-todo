import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TagFilter } from '../../../../src/components/todos/TagFilter';
import { useTags } from '../../../../src/hooks/useTags';

// Mock the useTags hook
vi.mock('../../../../src/hooks/useTags', () => ({
  useTags: vi.fn(),
}));

const mockUseTags = vi.mocked(useTags);

describe('TagFilter', () => {
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

  it('renders loading state', () => {
    mockUseTags.mockReturnValue({
      tags: [],
      loading: true,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    render(<TagFilter selectedTagIds={[]} onSelectionChange={vi.fn()} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByLabelText('タグを読み込み中')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseTags.mockReturnValue({
      tags: [],
      loading: false,
      error: 'Failed to load tags',
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    render(<TagFilter selectedTagIds={[]} onSelectionChange={vi.fn()} />);

    expect(screen.getByText('タグの読み込みに失敗しました')).toBeInTheDocument();
  });

  it('renders nothing when no tags available', () => {
    mockUseTags.mockReturnValue({
      tags: [],
      loading: false,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    const { container } = render(<TagFilter selectedTagIds={[]} onSelectionChange={vi.fn()} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders tag buttons', () => {
    render(<TagFilter selectedTagIds={[]} onSelectionChange={vi.fn()} />);

    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('shows selected count', () => {
    render(<TagFilter selectedTagIds={['tag1', 'tag2']} onSelectionChange={vi.fn()} />);

    expect(screen.getByText('タグでフィルタ (2 個選択)')).toBeInTheDocument();
  });

  it('calls onSelectionChange when tag is clicked', () => {
    const mockOnSelectionChange = vi.fn();

    render(<TagFilter selectedTagIds={[]} onSelectionChange={mockOnSelectionChange} />);

    fireEvent.click(screen.getByText('Work'));

    expect(mockOnSelectionChange).toHaveBeenCalledWith(['tag1']);
  });

  it('removes tag when selected tag is clicked', () => {
    const mockOnSelectionChange = vi.fn();

    render(<TagFilter selectedTagIds={['tag1']} onSelectionChange={mockOnSelectionChange} />);

    fireEvent.click(screen.getByText('Work'));

    expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
  });

  it('shows clear button when tags are selected', () => {
    render(<TagFilter selectedTagIds={['tag1']} onSelectionChange={vi.fn()} />);

    expect(screen.getByText('クリア')).toBeInTheDocument();
  });

  it('calls onSelectionChange with empty array when clear is clicked', () => {
    const mockOnSelectionChange = vi.fn();

    render(<TagFilter selectedTagIds={['tag1', 'tag2']} onSelectionChange={mockOnSelectionChange} />);

    fireEvent.click(screen.getByText('クリア'));

    expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
  });

  it('shows help text when tags are selected', () => {
    render(<TagFilter selectedTagIds={['tag1']} onSelectionChange={vi.fn()} />);

    expect(screen.getByText('選択したタグのいずれかを含むTodoが表示されます')).toBeInTheDocument();
  });

  it('does not show clear button when no tags are selected', () => {
    render(<TagFilter selectedTagIds={[]} onSelectionChange={vi.fn()} />);

    expect(screen.queryByText('クリア')).not.toBeInTheDocument();
  });

  it('does not show help text when no tags are selected', () => {
    render(<TagFilter selectedTagIds={[]} onSelectionChange={vi.fn()} />);

    expect(screen.queryByText('選択したタグのいずれかを含むTodoが表示されます')).not.toBeInTheDocument();
  });
});