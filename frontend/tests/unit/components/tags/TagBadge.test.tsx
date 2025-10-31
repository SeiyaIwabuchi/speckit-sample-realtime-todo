import { render, screen } from '@testing-library/react';
import TagBadge from '../../../../src/components/tags/TagBadge';
import React from 'react';

describe('TagBadge', () => {
  it('タグ名と色が表示される', () => {
    const tagName = '仕事';
    const tagColor = '#ff0000';

    render(<TagBadge name={tagName} color={tagColor} />);

    // タグ名が表示されていることを確認
    expect(screen.getByText(tagName)).toBeInTheDocument();

    // 背景色が正しく設定されていることを確認
    const badgeElement = screen.getByText(tagName);
    expect(badgeElement).toHaveStyle({ backgroundColor: tagColor });
  });
});
