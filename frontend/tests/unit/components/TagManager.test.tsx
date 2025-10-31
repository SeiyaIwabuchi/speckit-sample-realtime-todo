import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TagManager from '../../../src/components/TagManager';
import { useTags } from '../../../src/hooks/useTags';
import React from 'react';
import { vi, Mock } from 'vitest';

vi.mock('../../../src/hooks/useTags');

const mockTags = [
  { id: '1', name: '仕事', color: '#ff0000' },
  { id: '2', name: 'プライベート', color: '#00ff00' },
];

describe('TagManager UI', () => {
  beforeEach(() => {
    (useTags as Mock).mockReturnValue({
      tags: mockTags,
      createTag: vi.fn(),
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
      loading: false,
      error: null,
    });
  });

  it('タグ一覧が表示される', () => {
    render(<TagManager />);
    expect(screen.getByText('仕事')).toBeInTheDocument();
    expect(screen.getByText('プライベート')).toBeInTheDocument();
  });

  it('タグ追加フォームが表示される', () => {
    render(<TagManager />);
    expect(screen.getByPlaceholderText('タグ名')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /追加/ })).toBeInTheDocument();
  });

  it('タグ編集ボタンが表示される', () => {
    render(<TagManager />);
    expect(screen.getAllByRole('button', { name: /編集/ })).toHaveLength(mockTags.length);
  });

  it('タグ削除ボタンが表示される', () => {
    render(<TagManager />);
    expect(screen.getAllByRole('button', { name: /削除/ })).toHaveLength(mockTags.length);
  });

  it('タグ追加時にcreateTagが呼ばれる', async () => {
    const createTag = vi.fn();
    (useTags as Mock).mockReturnValue({
      ...useTags(),
      createTag,
    });
    render(<TagManager />);
    fireEvent.change(screen.getByPlaceholderText('タグ名'), { target: { value: '新規タグ' } });
    fireEvent.click(screen.getByRole('button', { name: /追加/ }));
    await waitFor(() => {
      expect(createTag).toHaveBeenCalledWith({ name: '新規タグ', color: expect.any(String) });
    });
  });

  // 編集・削除のテストも同様に追加可能
});
