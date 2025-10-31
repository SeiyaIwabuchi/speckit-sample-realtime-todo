import { render } from '@testing-library/react';
import TagBadge from '../../../src/components/tags/TagBadge';
import React from 'react';

describe('TagBadge', () => {
  it('タグ名と色が表示される', () => {
    render(<TagBadge name="仕事" color="#ff0000" />);
    // 実装前なので失敗するはず
    expect(false).toBe(true);
  });
});
