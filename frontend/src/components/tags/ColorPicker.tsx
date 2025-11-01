import React from 'react';
import { COLOR_PALETTE } from '../../types/tag';

type Props = {
  selectedColor: string;
  onChange: (color: string) => void;
};

const ColorPicker: React.FC<Props> = ({ selectedColor, onChange }) => {
  return (
    <div className="flex gap-2">
      {COLOR_PALETTE.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
          style={{ backgroundColor: color }}
          aria-label={color}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
