import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { Tag } from '../types/tag';
import { tagService } from '../services/tagService';
import { analyticsService } from '../services/analyticsService';
import { toastService } from '../services/toastService';

export function useTags() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setTags([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = tagService.subscribeTags(user.id, (tags) => {
      setTags(tags);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user?.id]);

  // createTag, updateTag, deleteTag をラップ
  const createTag = useCallback(
    async (tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => {
      setError(null);
      try {
        await tagService.createTag(tag);
        await analyticsService.trackTagCreated();
      } catch (e: any) {
        const msg = e.message || 'タグ作成に失敗しました';
        setError(msg);
        toastService.error(msg);
        throw e;
      }
    },
    []
  );

  const updateTag = useCallback(
    async (tagId: string, updates: Partial<Tag>) => {
      setError(null);
      try {
        await tagService.updateTag(tagId, updates);
        await analyticsService.trackTagUpdated();
      } catch (e: any) {
        const msg = e.message || 'タグ更新に失敗しました';
        setError(msg);
        toastService.error(msg);
        throw e;
      }
    },
    []
  );

  const deleteTag = useCallback(
    async (tagId: string) => {
      setError(null);
      try {
        if (!user?.id) throw new Error('ユーザー情報がありません');
        await tagService.deleteTag(tagId, user.id);
        await analyticsService.trackTagDeleted();
      } catch (e: any) {
        const msg = e.message || 'タグ削除に失敗しました';
        setError(msg);
        toastService.error(msg);
        throw e;
      }
    },
    [user?.id]
  );

  return { tags, loading, error, createTag, updateTag, deleteTag };
}
