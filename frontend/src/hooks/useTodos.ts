import { useState, useEffect, useCallback } from 'react';
import { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';
import { TodoService } from '../services/todoService';
import { useAuthContext } from '../contexts/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { toastService } from '../services/toastService';
import { handleError } from '../utils/errorHandling';

export interface UseTodosOptions {
  tagIds?: string[];
}

export interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (data: CreateTodoData) => Promise<void>;
  updateTodo: (id: string, data: UpdateTodoData) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  refreshTodos: () => void;
}

export const useTodos = (options: UseTodosOptions = {}): UseTodosReturn => {
  const { tagIds = [] } = options;
  const { user } = useAuthContext();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Todo一覧をリアルタイムで監視
  useEffect(() => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = tagIds.length > 0
      ? TodoService.subscribeToFilteredTodos(user.id, tagIds, (fetchedTodos) => {
          setTodos(fetchedTodos);
          setLoading(false);
        })
      : TodoService.subscribeToTodos(user.id, (fetchedTodos) => {
          setTodos(fetchedTodos);
          setLoading(false);
        });

    return unsubscribe;
  }, [user, tagIds]);

  // Todo作成
  const createTodo = useCallback(async (data: CreateTodoData) => {
    if (!user) {
      throw new Error('ログインが必要です');
    }

    try {
      setError(null);
      await TodoService.createTodo(user.id, data);
      await analyticsService.trackTodoCreated(data.tagIds && data.tagIds.length > 0);
      toastService.success('Todoが作成されました');
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      toastService.error(errorMessage);
      throw err;
    }
  }, [user]);

  // Todo更新
  const updateTodo = useCallback(async (id: string, data: UpdateTodoData) => {
    try {
      setError(null);
      await TodoService.updateTodo(id, data);
      await analyticsService.trackTodoUpdated(data.tagIds && data.tagIds.length > 0);
      toastService.success('Todoが更新されました');
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      toastService.error(errorMessage);
      throw err;
    }
  }, []);

  // Todo削除
  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      await TodoService.deleteTodo(id);
      await analyticsService.trackTodoDeleted();
      toastService.success('Todoが削除されました');
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      toastService.error(errorMessage);
      throw err;
    }
  }, []);

  // Todo完了/未完了切り替え
  const toggleTodo = useCallback(async (id: string, completed: boolean) => {
    try {
      setError(null);
      await TodoService.toggleTodo(id, completed);
      if (completed) {
        // 完了したTodoのタグ情報を取得
        const todo = todos.find(t => t.id === id);
        await analyticsService.trackTodoCompleted(todo?.tagIds && todo.tagIds.length > 0);
      }
      const message = completed ? 'Todoが完了しました' : 'Todoが未完了に戻りました';
      toastService.success(message);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      toastService.error(errorMessage);
      throw err;
    }
  }, [todos]);

  // Todo一覧をリフレッシュ（手動更新用）
  const refreshTodos = useCallback(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    // 現在の購読を維持しつつ、エラーハンドリングを行う
    try {
      const unsubscribe = TodoService.subscribeToTodos(user.id, (fetchedTodos) => {
        setTodos(fetchedTodos);
        setLoading(false);
      });

      // 少し待ってから購読を解除（次のuseEffectで新しい購読が設定される）
      setTimeout(unsubscribe, 100);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      setLoading(false);
    }
  }, [user]);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refreshTodos,
  };
};