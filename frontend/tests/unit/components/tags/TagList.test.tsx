import { render, screen } from '@testing-library/react';
import TagList from '../../../src/components/tags/TagList';
import React from 'react';

describe('TagList', () => {
  it('タグ一覧が表示される', () => {
    render(<TagList tags={[]} onEdit={jest.fn()} onDelete={jest.fn()} />);
    // 実装前なので失敗するはず
    expect(false).toBe(true);
  });
});
