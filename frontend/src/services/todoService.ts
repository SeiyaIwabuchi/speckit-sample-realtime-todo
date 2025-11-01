import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';

export class TodoService {
  private static readonly COLLECTION_NAME = 'todos';

  /**
   * undefinedのフィールドを除外するヘルパー関数
   */
  private static sanitizeData<T extends Record<string, any>>(data: T): Partial<T> {
    const sanitized: Partial<T> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sanitized[key as keyof T] = value;
      }
    }
    return sanitized;
  }

  /**
   * 新しいTodoを作成
   */
  static async createTodo(userId: string, data: CreateTodoData): Promise<Todo> {
    try {
      const todoData = {
        ...data,
        userId,
        completed: false,
        tagIds: data.tagIds || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // undefinedのフィールドを除外
      const sanitizedData = this.sanitizeData(todoData);

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), sanitizedData);

      return {
        id: docRef.id,
        ...todoData,
      };
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('Todoの作成に失敗しました');
    }
  }

  /**
   * Todoを更新
   */
  static async updateTodo(todoId: string, data: UpdateTodoData): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      // undefinedのフィールドを除外
      const sanitizedData = this.sanitizeData(updateData);

      const todoRef = doc(db, this.COLLECTION_NAME, todoId);
      await updateDoc(todoRef, sanitizedData);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw new Error('Todoの更新に失敗しました');
    }
  }

  /**
   * Todoを削除
   */
  static async deleteTodo(todoId: string): Promise<void> {
    try {
      const todoRef = doc(db, this.COLLECTION_NAME, todoId);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('Todoの削除に失敗しました');
    }
  }

  /**
   * ユーザーのTodo一覧をリアルタイムで監視
   */
  static subscribeToTodos(userId: string, callback: (todos: Todo[]) => void): () => void {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      return onSnapshot(q, (querySnapshot) => {
        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          todos.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            tagIds: data.tagIds || [],
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt || new Date(),
            userId: data.userId,
          } as Todo);
        });
        callback(todos);
      }, (error) => {
        console.error('Error subscribing to todos:', error);
        throw new Error('Todo一覧の取得に失敗しました');
      });
    } catch (error) {
      console.error('Error setting up todo subscription:', error);
      throw new Error('Todo一覧の監視設定に失敗しました');
    }
  }

  /**
   * フィルタリングされたTodo一覧をリアルタイムで監視
   */
  static subscribeToFilteredTodos(
    userId: string,
    tagIds: string[],
    callback: (todos: Todo[]) => void
  ): () => void {
    try {
      let q;

      if (tagIds.length === 0) {
        // タグフィルタなしの場合は通常のクエリ
        q = query(
          collection(db, this.COLLECTION_NAME),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      } else {
        // タグフィルタありの場合は array-contains-any を使用
        q = query(
          collection(db, this.COLLECTION_NAME),
          where('userId', '==', userId),
          where('tagIds', 'array-contains-any', tagIds),
          orderBy('createdAt', 'desc')
        );
      }

      return onSnapshot(q, (querySnapshot) => {
        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          todos.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            completed: data.completed,
            tagIds: data.tagIds || [],
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt || new Date(),
            userId: data.userId,
          } as Todo);
        });
        callback(todos);
      }, (error) => {
        console.error('Error subscribing to filtered todos:', error);
        throw new Error('フィルタリングされたTodo一覧の取得に失敗しました');
      });
    } catch (error) {
      console.error('Error setting up filtered todo subscription:', error);
      throw new Error('フィルタリングされたTodo一覧の監視設定に失敗しました');
    }
  }

  /**
   * Todoを完了/未完了に切り替え
   */
  static async toggleTodo(todoId: string, completed: boolean): Promise<void> {
    try {
      await this.updateTodo(todoId, { completed });
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw new Error('Todoの状態変更に失敗しました');
    }
  }
}