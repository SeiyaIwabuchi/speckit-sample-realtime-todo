import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FilterBar } from '../../../../src/components/todos/FilterBar';

// Mock TagFilter component
vi.mock('../../../../src/components/todos/TagFilter', () => ({
  TagFilter: vi.fn(),
}));

import { TagFilter } from '../../../../src/components/todos/TagFilter';

const mockTagFilter = vi.mocked(TagFilter);

describe('FilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTagFilter.mockImplementation(() => <div>TagFilter Component</div>);
  });

  it('renders nothing when no tags are selected', () => {
    const { container } = render(
      <FilterBar selectedTagIds={[]} onTagSelectionChange={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders TagFilter when tags are selected', () => {
    render(
      <FilterBar selectedTagIds={['tag1']} onTagSelectionChange={vi.fn()} />
    );

    expect(mockTagFilter).toHaveBeenCalledWith(
      {
        selectedTagIds: ['tag1'],
        onSelectionChange: expect.any(Function),
      },
      {}
    );
  });

  it('passes correct props to TagFilter', () => {
    const mockOnTagSelectionChange = vi.fn();

    render(
      <FilterBar
        selectedTagIds={['tag1', 'tag2']}
        onTagSelectionChange={mockOnTagSelectionChange}
      />
    );

    expect(mockTagFilter).toHaveBeenCalledWith(
      {
        selectedTagIds: ['tag1', 'tag2'],
        onSelectionChange: mockOnTagSelectionChange,
      },
      {}
    );
  });
});