import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TagSelector } from '../../../../src/components/todos/TagSelector';
import { useTags } from '../../../../src/hooks/useTags';

// Mock the useTags hook
vi.mock('../../../../src/hooks/useTags', () => ({
  useTags: vi.fn(),
}));

const mockUseTags = vi.mocked(useTags);

describe('TagSelector', () => {
  const mockTags = [
    { id: '1', name: 'Work', color: 'bg-blue-500', createdAt: new Date(), updatedAt: new Date(), userId: 'user1' },
    { id: '2', name: 'Personal', color: 'bg-green-500', createdAt: new Date(), updatedAt: new Date(), userId: 'user1' },
    { id: '3', name: 'Urgent', color: 'bg-red-500', createdAt: new Date(), updatedAt: new Date(), userId: 'user1' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
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

    render(
      <TagSelector
        selectedTagIds={[]}
        onSelectionChange={vi.fn()}
      />
    );

    // Check for loading skeleton elements - just verify the skeleton is rendered
    expect(screen.getAllByRole('generic').some(el => el.classList.contains('animate-pulse'))).toBe(true);
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

    render(
      <TagSelector
        selectedTagIds={[]}
        onSelectionChange={vi.fn()}
      />
    );

    expect(screen.getByText('タグの読み込みに失敗しました')).toBeInTheDocument();
  });

  it('renders empty state when no tags available', () => {
    mockUseTags.mockReturnValue({
      tags: [],
      loading: false,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    render(
      <TagSelector
        selectedTagIds={[]}
        onSelectionChange={vi.fn()}
      />
    );

    expect(screen.getByText('利用可能なタグがありません。タグ管理ページで作成してください。')).toBeInTheDocument();
  });

  it('renders tags and allows selection', async () => {
    const mockOnSelectionChange = vi.fn();

    mockUseTags.mockReturnValue({
      tags: mockTags,
      loading: false,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    render(
      <TagSelector
        selectedTagIds={[]}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    // Check that tags are rendered
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.getByText('Urgent')).toBeInTheDocument();

    // Select a tag
    const workCheckbox = screen.getByLabelText('Work');
    fireEvent.click(workCheckbox);

    expect(mockOnSelectionChange).toHaveBeenCalledWith(['1']);
  });

  it('allows deselection of selected tags', () => {
    const mockOnSelectionChange = vi.fn();

    mockUseTags.mockReturnValue({
      tags: mockTags,
      loading: false,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    render(
      <TagSelector
        selectedTagIds={['1']}
        onSelectionChange={mockOnSelectionChange}
      />
    );

    const workCheckbox = screen.getByLabelText('Work');
    expect(workCheckbox).toBeChecked();

    // Deselect the tag
    fireEvent.click(workCheckbox);

    expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
  });

  it('respects max selection limit', () => {
    const mockOnSelectionChange = vi.fn();

    mockUseTags.mockReturnValue({
      tags: mockTags,
      loading: false,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    render(
      <TagSelector
        selectedTagIds={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']}
        onSelectionChange={mockOnSelectionChange}
        maxSelection={20}
      />
    );

    // Try to select another tag when at max
    const workCheckbox = screen.getByLabelText('Work');
    fireEvent.click(workCheckbox);

    // Should not call onSelectionChange since at max
    expect(mockOnSelectionChange).not.toHaveBeenCalled();

    expect(screen.getByText('最大 20 個まで選択できます')).toBeInTheDocument();
  });

  it('disables checkboxes when disabled prop is true', () => {
    mockUseTags.mockReturnValue({
      tags: mockTags,
      loading: false,
      error: null,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
    });

    render(
      <TagSelector
        selectedTagIds={[]}
        onSelectionChange={vi.fn()}
        disabled={true}
      />
    );

    const workCheckbox = screen.getByLabelText('Work');
    expect(workCheckbox).toBeDisabled();
  });
});