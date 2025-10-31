import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TagManager from '../../../src/components/TagManager';
import { useTags } from '../../../src/hooks/useTags';
import { useAuth } from '../../../src/hooks/useAuth';
import React from 'react';
import { vi, Mock } from 'vitest';

vi.mock('../../../src/hooks/useTags');
vi.mock('../../../src/hooks/useAuth');

const mockTags = [
  { id: '1', name: '仕事', color: '#ff0000' },
  { id: '2', name: 'プライベート', color: '#00ff00' },
];

const mockUser = { id: 'user1', email: 'test@example.com' };

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
    (useAuth as Mock).mockReturnValue({
      user: mockUser,
    });
  });

  it('タグ一覧が表示される', () => {
    render(<TagManager />);
    // タグ名が表示されていることを確認（タグ一覧セクション内）
    const tagList = screen.getByRole('list', { name: 'タグ一覧' });
    expect(tagList).toHaveTextContent('仕事');
    expect(tagList).toHaveTextContent('プライベート');
  });

  it('タグ追加フォームが表示される', () => {
    render(<TagManager />);
    expect(screen.getByPlaceholderText('タグ名')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /作成/ })).toBeInTheDocument();
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
      tags: mockTags,
      createTag,
      updateTag: vi.fn(),
      deleteTag: vi.fn(),
      loading: false,
      error: null,
    });
    (useAuth as Mock).mockReturnValue({
      user: mockUser,
    });
    render(<TagManager />);
    fireEvent.change(screen.getByPlaceholderText('タグ名'), { target: { value: '新規タグ' } });
    fireEvent.click(screen.getByRole('button', { name: /作成/ }));
    await waitFor(() => {
      expect(createTag).toHaveBeenCalledWith({ name: '新規タグ', color: expect.any(String), userId: mockUser.id });
    });
  });

  // 編集・削除のテストも同様に追加可能
});
