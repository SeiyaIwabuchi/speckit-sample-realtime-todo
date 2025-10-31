/// <reference types="vitest/globals" />
import { renderHook, act } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import { useTags } from '../../../src/hooks/useTags';
import { tagService } from '../../../src/services/tagService';
import { Tag } from '../../../src/types/tag';

vi.mock('../../../src/services/tagService');
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user1', email: 'test@example.com' },
    loading: false,
    error: null,
  })),
}));

const mockTags: Tag[] = [
  {
    id: '1',
    name: '仕事',
    color: '#3B82F6',
    userId: 'user1',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'プライベート',
    color: '#EF4444',
    userId: 'user1',
    createdAt: new Date(),
  },
];

describe('useTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe and set tags', () => {
    (tagService.subscribeTags as Mock).mockImplementation((userId, cb) => {
      cb(mockTags);
      return vi.fn();
    });
    const { result } = renderHook(() => useTags());
    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should call createTag and handle error', async () => {
    (tagService.createTag as Mock).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useTags());
    await act(async () => {
      await result.current.createTag({ name: '新規', color: '#3B82F6', userId: 'user1' });
    });
    expect(tagService.createTag).toHaveBeenCalled();
    (tagService.createTag as Mock).mockRejectedValueOnce(new Error('重複'));
    await act(async () => {
      await expect(result.current.createTag({ name: '重複', color: '#3B82F6', userId: 'user1' })).rejects.toThrow('重複');
    });
    expect(result.current.error).toBe('重複');
  });

  it('should call updateTag and handle error', async () => {
    (tagService.updateTag as Mock).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useTags());
    await act(async () => {
      await result.current.updateTag('1', { name: '更新' });
    });
    expect(tagService.updateTag).toHaveBeenCalled();
    (tagService.updateTag as Mock).mockRejectedValueOnce(new Error('更新失敗'));
    await act(async () => {
      await expect(result.current.updateTag('1', { name: '更新' })).rejects.toThrow('更新失敗');
    });
    expect(result.current.error).toBe('更新失敗');
  });

  it('should call deleteTag and handle error', async () => {
    (tagService.deleteTag as Mock).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useTags());
    await act(async () => {
      await result.current.deleteTag('1');
    });
    expect(tagService.deleteTag).toHaveBeenCalled();
    (tagService.deleteTag as Mock).mockRejectedValueOnce(new Error('削除失敗'));
    await act(async () => {
      await expect(result.current.deleteTag('1')).rejects.toThrow('削除失敗');
    });
    expect(result.current.error).toBe('削除失敗');
  });
});
