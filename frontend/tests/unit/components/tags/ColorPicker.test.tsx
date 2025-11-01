import { render, screen, fireEvent } from '@testing-library/react';
import ColorPicker from '../../../../src/components/tags/ColorPicker';
import React from 'react';
import { vi } from 'vitest';
import { COLOR_PALETTE } from '../../../../src/types/tag';

describe('ColorPicker', () => {
  it('10色のカラースウォッチが表示される', () => {
    render(<ColorPicker selectedColor="#EF4444" onChange={() => {}} />);

    COLOR_PALETTE.forEach(color => {
      expect(screen.getByLabelText(color)).toBeInTheDocument();
    });
  });

  it('色を選択するとonChangeが呼ばれる', () => {
    const mockOnChange = vi.fn();
    const clickedColor = COLOR_PALETTE[3]; // #22C55E (緑)

    render(<ColorPicker selectedColor="#EF4444" onChange={mockOnChange} />);

    // クリックする色ボタンを探す
    const colorButton = screen.getByLabelText(clickedColor);
    fireEvent.click(colorButton);

    expect(mockOnChange).toHaveBeenCalledWith(clickedColor);
  });

  it('選択された色に黒いボーダーが表示される', () => {
    const selectedColor = COLOR_PALETTE[0]; // #EF4444 (赤)

    render(<ColorPicker selectedColor={selectedColor} onChange={() => {}} />);

    // 選択された色ボタンに黒いボーダーが付いていることを確認
    const selectedButton = screen.getByLabelText(selectedColor);
    expect(selectedButton).toHaveClass('border-black');
  });
});
