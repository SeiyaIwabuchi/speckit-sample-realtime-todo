/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoListSkeleton from '../../../../src/components/todos/TodoListSkeleton';
import { describe, it, expect } from 'vitest';

describe('TodoListSkeleton', () => {
  it('スケルトンが5つ表示される', () => {
    render(<TodoListSkeleton />);
    const skeletonContainer = screen.getByTestId('todo-list-skeleton');
    expect(skeletonContainer).toBeInTheDocument();
    expect(skeletonContainer.querySelectorAll('div.animate-pulse').length).toBe(5);
  });
});
