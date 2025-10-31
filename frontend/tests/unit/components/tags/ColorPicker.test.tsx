import { render, screen } from '@testing-library/react';
import ColorPicker from '../../../src/components/tags/ColorPicker';
import React from 'react';

describe('ColorPicker', () => {
  it('10色のカラースウォッチが表示される', () => {
    render(<ColorPicker selectedColor="#ff0000" onChange={() => {}} />);
    // 10個の色ボタンが表示されること
    expect(screen.getAllByRole('button')).toHaveLength(10);
  });

  it('色を選択するとonChangeが呼ばれる', () => {
    // 実装前なので失敗するはず
    expect(false).toBe(true);
  });
});
