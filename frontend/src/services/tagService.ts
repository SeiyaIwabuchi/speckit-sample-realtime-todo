// TagService interface & skeleton for User Story 4
import { Tag } from '../types/tag';
import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

export interface TagService {
  createTag(tag: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag>;
  updateTag(tagId: string, updates: Partial<Tag>): Promise<void>;
  deleteTag(tagId: string, userId: string): Promise<void>;
  subscribeTags(userId: string, callback: (tags: Tag[]) => void): () => void;
  getTagById(tagId: string): Promise<Tag | null>;
}

// Skeleton implementation (to be filled)
export const tagService: TagService = {
  async createTag(tag) {
    // タグ名重複チェック
    const tagsRef = collection(db, 'tags');
    const q = query(tagsRef, where('name', '==', tag.name), where('userId', '==', tag.userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error('タグ名が重複しています');
    }

    // タグ作成
    const docRef = await addDoc(tagsRef, {
      name: tag.name,
      color: tag.color,
      userId: tag.userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 作成したタグ情報を返却
    return {
      id: docRef.id,
      name: tag.name,
      color: tag.color,
      userId: tag.userId,
      createdAt: new Date(), // serverTimestamp()はDate型で取得できないため仮
    };
  },
  async updateTag(tagId, updates) {
    // タグ名重複チェック（自分以外の同名タグ）
    if (updates.name) {
      if (!updates.userId) {
        throw new Error('userIdが指定されていません');
      }
      const tagsRef = collection(db, 'tags');
      const q = query(tagsRef, where('name', '==', updates.name), where('userId', '==', updates.userId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const duplicate = snapshot.docs.find(doc => doc.id !== tagId);
        if (duplicate) {
          throw new Error('タグ名が重複しています');
        }
      }
    }
    // タグ更新
    const tagRef = doc(db, 'tags', tagId);
    await updateDoc(tagRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    // Todoのtag情報も更新（name/color変更時）
    if (updates.name || updates.color) {
      if (!updates.userId) {
        throw new Error('userIdが指定されていません');
      }
      const todosRef = collection(db, 'todos');
      const q = query(
        todosRef,
        where('userId', '==', updates.userId),
        where('tagIds', 'array-contains', tagId)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach((_todoDoc) => {
        // FirestoreのTodoにはtagIdsのみ保持している場合は何もしない
        // tag情報を埋め込んでいる場合はここで更新（現状tagIdsのみなら不要）
        // もしtag情報を埋め込む設計ならここでname/colorを更新
      });
      await batch.commit();
    }
  },
  async deleteTag(tagId: string, userId: string) {
    if (!userId) {
      throw new Error('userIdが指定されていません');
    }
    // タグ削除
    const tagRef = doc(db, 'tags', tagId);
    await deleteDoc(tagRef);

    // Todoから該当tagIdを除去（カスケード）
    const todosRef = collection(db, 'todos');
    const q = query(
      todosRef,
      where('userId', '==', userId),
      where('tagIds', 'array-contains', tagId)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((todoDoc) => {
      const todoData = todoDoc.data();
      const newTagIds = (todoData.tagIds || []).filter((id: string) => id !== tagId);
      batch.update(todoDoc.ref, { tagIds: newTagIds });
    });
    await batch.commit();
    // UI側で削除後のTodoリスト反映を必ず行うこと
  },
  subscribeTags(userId, callback) {
    const tagsRef = query(collection(db, 'tags'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(tagsRef, (snapshot) => {
      const tags = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          color: data.color,
          userId: data.userId,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
      });
      callback(tags);
    });
    return unsubscribe;
  },
  async getTagById(_tagId: string) {
    // TODO: Firestore getDoc
    return null;
  },
};
