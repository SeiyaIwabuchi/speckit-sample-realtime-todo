import { render, screen, fireEvent } from '@testing-library/react';
import EditTagForm from '../../../src/components/tags/EditTagForm';
import React from 'react';

describe('EditTagForm', () => {
  it('初期値が表示される', () => {
    render(<EditTagForm tag={{ id: '1', name: '仕事', color: '#F87171', createdAt: new Date(), userId: 'u1' }} onSubmit={jest.fn()} />);
    expect(screen.getByDisplayValue('仕事')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(10); // ColorPicker
  });

  it('タグ名が空の場合はバリデーションエラー', () => {
    render(<EditTagForm tag={{ id: '1', name: '', color: '#F87171', createdAt: new Date(), userId: 'u1' }} onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /保存/ }));
    expect(screen.getByText(/タグ名は必須です/)).toBeInTheDocument();
  });

  it('重複名の場合はバリデーションエラー', () => {
    // 実装前なので失敗するはず
    expect(false).toBe(true);
  });
});
