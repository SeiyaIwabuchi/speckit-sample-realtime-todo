import { render, screen, fireEvent } from '@testing-library/react';
import EditTagForm from '../../../../src/components/tags/EditTagForm';
import React from 'react';
import { vi } from 'vitest';

describe('EditTagForm', () => {
  it('初期値が表示される', () => {
    render(<EditTagForm tag={{ id: '1', name: '仕事', color: '#F87171', createdAt: new Date(), userId: 'u1' }} onSubmit={vi.fn()} />);
    expect(screen.getByDisplayValue('仕事')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(11); // ColorPickerの10色 + 保存ボタン
  });

  it('タグ名が空の場合はバリデーションエラー', () => {
    render(<EditTagForm tag={{ id: '1', name: '', color: '#F87171', createdAt: new Date(), userId: 'u1' }} onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /保存/ }));
    expect(screen.getByText(/タグ名は必須です/)).toBeInTheDocument();
  });

  it('重複名の場合はバリデーションエラー', () => {
    const errorMessage = 'タグ名が重複しています';
    render(<EditTagForm tag={{ id: '1', name: '仕事', color: '#F87171', createdAt: new Date(), userId: 'u1' }} onSubmit={vi.fn()} error={errorMessage} />);

    // エラーメッセージが表示されていることを確認
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('フォーム送信時にonSubmitが呼ばれる', () => {
    const mockOnSubmit = vi.fn();
    const initialTag = { id: '1', name: '仕事', color: '#F87171', createdAt: new Date(), userId: 'u1' };

    render(<EditTagForm tag={initialTag} onSubmit={mockOnSubmit} />);

    // タグ名を変更
    const nameInput = screen.getByDisplayValue('仕事');
    fireEvent.change(nameInput, { target: { value: '仕事（更新）' } });

    // フォームを送信
    fireEvent.click(screen.getByRole('button', { name: /保存/ }));

    // onSubmitが正しい値で呼ばれたことを確認
    expect(mockOnSubmit).toHaveBeenCalledWith('仕事（更新）', '#F87171');
  });

  it('送信中はボタンが無効化され、スピナーが表示される', () => {
    const initialTag = { id: '1', name: '仕事', color: '#F87171', createdAt: new Date(), userId: 'u1' };

    render(<EditTagForm tag={initialTag} onSubmit={vi.fn()} isSubmitting={true} />);

    // 保存ボタンが存在しないことを確認（isSubmitting時はSpinnerだけ表示）
    expect(screen.queryByRole('button', { name: /保存/ })).not.toBeInTheDocument();

    // スピナーが表示されていることを確認
    expect(screen.getByLabelText('読み込み中')).toBeInTheDocument();
  });
});
