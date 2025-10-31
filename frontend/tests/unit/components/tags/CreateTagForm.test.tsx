/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from '@testing-library/react';
import CreateTagForm from '../../../../src/components/tags/CreateTagForm';
import React from 'react';
import { vi } from 'vitest';

describe('CreateTagForm', () => {
  it('タグ名入力欄とColorPickerが表示される', () => {
    render(<CreateTagForm onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText('タグ名')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(11); // ColorPickerの10色 + 作成ボタン
  });

  it('タグ名が空の場合はバリデーションエラー', () => {
    render(<CreateTagForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /作成/ }));
    expect(screen.getByText(/タグ名は必須です/)).toBeInTheDocument();
  });

  it('重複名の場合はバリデーションエラー', () => {
    const errorMessage = 'タグ名が重複しています';
    render(<CreateTagForm onSubmit={vi.fn()} error={errorMessage} />);

    // エラーメッセージが表示されていることを確認
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('フォーム送信時にonSubmitが呼ばれる', () => {
    const mockOnSubmit = vi.fn();
    render(<CreateTagForm onSubmit={mockOnSubmit} />);

    // タグ名を入力
    const nameInput = screen.getByPlaceholderText('タグ名');
    fireEvent.change(nameInput, { target: { value: '新しいタグ' } });

    // フォームを送信
    fireEvent.click(screen.getByRole('button', { name: /作成/ }));

    // onSubmitが正しい値で呼ばれたことを確認
    expect(mockOnSubmit).toHaveBeenCalledWith('新しいタグ', '#F87171');
  });

  it('送信中はボタンが無効化され、スピナーが表示される', () => {
    render(<CreateTagForm onSubmit={vi.fn()} isSubmitting={true} />);

    // 作成ボタンが存在しないことを確認（isSubmitting時はSpinnerだけ表示）
    expect(screen.queryByRole('button', { name: /作成/ })).not.toBeInTheDocument();

    // スピナーが表示されていることを確認
    expect(screen.getByLabelText('読み込み中')).toBeInTheDocument();
  });
});
