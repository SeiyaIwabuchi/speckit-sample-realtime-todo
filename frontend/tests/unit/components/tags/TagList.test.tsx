import { render, screen, fireEvent } from '@testing-library/react';
import TagList from '../../../../src/components/tags/TagList';
import React from 'react';
import { vi } from 'vitest';
import { Tag } from '../../../../src/types/tag';

describe('TagList', () => {
  it('タグ一覧が表示される', () => {
    const mockTags: Tag[] = [
      {
        id: 'tag1',
        name: '仕事',
        color: '#ff0000',
        userId: 'user123',
        createdAt: new Date(),
      },
      {
        id: 'tag2',
        name: '個人',
        color: '#00ff00',
        userId: 'user123',
        createdAt: new Date(),
      },
    ];

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(<TagList tags={mockTags} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // タグ名が表示されていることを確認（TagBadgeとspanの両方に表示される）
    expect(screen.getAllByText('仕事')).toHaveLength(2);
    expect(screen.getAllByText('個人')).toHaveLength(2);

    // 編集ボタンが表示されていることを確認
    const editButtons = screen.getAllByRole('button', { name: /編集/ });
    expect(editButtons).toHaveLength(2);

    // 削除ボタンが表示されていることを確認
    const deleteButtons = screen.getAllByRole('button', { name: /削除/ });
    expect(deleteButtons).toHaveLength(2);
  });

  it('空のタグリストの場合、適切なメッセージが表示される', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(<TagList tags={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // 空の状態を示すメッセージが表示されていることを確認
    expect(screen.getByText('タグがありません')).toBeInTheDocument();
  });

  it('編集ボタンをクリックするとonEditが呼ばれる', () => {
    const mockTag: Tag = {
      id: 'tag1',
      name: '仕事',
      color: '#ff0000',
      userId: 'user123',
      createdAt: new Date(),
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(<TagList tags={[mockTag]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // 編集ボタンをクリック
    const editButton = screen.getByRole('button', { name: '仕事タグを編集' });
    fireEvent.click(editButton);

    // onEditが正しいタグで呼ばれたことを確認
    expect(mockOnEdit).toHaveBeenCalledWith(mockTag);
  });

  it('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    const mockTag: Tag = {
      id: 'tag1',
      name: '仕事',
      color: '#ff0000',
      userId: 'user123',
      createdAt: new Date(),
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(<TagList tags={[mockTag]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    // 削除ボタンをクリック
    const deleteButton = screen.getByRole('button', { name: '仕事タグを削除' });
    fireEvent.click(deleteButton);

    // onDeleteが正しいタグで呼ばれたことを確認
    expect(mockOnDelete).toHaveBeenCalledWith(mockTag);
  });
});
