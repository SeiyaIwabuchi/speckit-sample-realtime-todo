import { render, screen, fireEvent } from '@testing-library/react';
import CreateTagForm from '../../../src/components/tags/CreateTagForm';
import React from 'react';

describe('CreateTagForm', () => {
  it('タグ名入力欄とColorPickerが表示される', () => {
    render(<CreateTagForm onSubmit={jest.fn()} />);
    expect(screen.getByPlaceholderText('タグ名')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(10); // ColorPicker
  });

  it('タグ名が空の場合はバリデーションエラー', () => {
    render(<CreateTagForm onSubmit={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /作成/ }));
    expect(screen.getByText(/タグ名は必須です/)).toBeInTheDocument();
  });

  it('重複名の場合はバリデーションエラー', () => {
    // 実装前なので失敗するはず
    expect(false).toBe(true);
  });
});
