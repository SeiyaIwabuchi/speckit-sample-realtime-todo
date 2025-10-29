# Service Contracts: リアルタイムTodo管理

**Feature**: 001-realtime-todo-crud  
**Date**: 2025-10-29  
**Phase**: 1 - Service Contracts

## Overview

FirestoreをバックエンドとするためREST APIは不要。代わりに、フロントエンドサービス層の契約（TypeScript interfaces）とFirestore操作パターンを定義。

## Service Layer Architecture

```
Components
    ↓ (use hooks)
Custom Hooks (useTodos, useTags, useAuth)
    ↓ (call services)
Service Layer (todoService, tagService, authService)
    ↓ (interact with)
Firebase SDK (Firestore, Auth)
```

## Authentication Service Contract

### Interface: `AuthService`

```typescript
// src/services/authService.ts

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthService {
  /**
   * 現在の認証状態を監視
   * @param callback - 認証状態変更時に呼ばれるコールバック
   * @returns unsubscribe関数
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
  
  /**
   * メールアドレスとパスワードでサインアップ
   * @throws {FirebaseError} 認証エラー
   */
  signUpWithEmail(email: string, password: string): Promise<AuthUser>;
  
  /**
   * メールアドレスとパスワードでサインイン
   * @throws {FirebaseError} 認証エラー
   */
  signInWithEmail(email: string, password: string): Promise<AuthUser>;
  
  /**
   * Googleアカウントでサインイン
   * @throws {FirebaseError} 認証エラー
   */
  signInWithGoogle(): Promise<AuthUser>;
  
  /**
   * サインアウト
   */
  signOut(): Promise<void>;
  
  /**
   * 現在のユーザーを取得
   */
  getCurrentUser(): AuthUser | null;
}
```

### Error Handling

```typescript
enum AuthErrorCode {
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  INVALID_EMAIL = 'auth/invalid-email',
  WRONG_PASSWORD = 'auth/wrong-password',
  USER_NOT_FOUND = 'auth/user-not-found',
  WEAK_PASSWORD = 'auth/weak-password',
  POPUP_CLOSED = 'auth/popup-closed-by-user',
  NETWORK_ERROR = 'auth/network-request-failed'
}

export function handleAuthError(error: FirebaseError): string {
  switch (error.code) {
    case AuthErrorCode.EMAIL_ALREADY_IN_USE:
      return 'このメールアドレスは既に使用されています';
    case AuthErrorCode.INVALID_EMAIL:
      return 'メールアドレスの形式が正しくありません';
    case AuthErrorCode.WRONG_PASSWORD:
    case AuthErrorCode.USER_NOT_FOUND:
      return 'メールアドレスまたはパスワードが正しくありません';
    case AuthErrorCode.WEAK_PASSWORD:
      return 'パスワードは6文字以上である必要があります';
    case AuthErrorCode.POPUP_CLOSED:
      return 'サインインがキャンセルされました';
    case AuthErrorCode.NETWORK_ERROR:
      return 'ネットワークエラーが発生しました。接続を確認してください';
    default:
      return '認証エラーが発生しました';
  }
}
```

---

## Todo Service Contract

### Interface: `TodoService`

```typescript
// src/services/todoService.ts

export interface CreateTodoInput {
  title: string;
  description?: string;
  tagIds?: string[];
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  tagIds?: string[];
}

export interface TodoService {
  /**
   * ユーザーのTodo一覧をリアルタイムで監視
   * @param userId - ユーザーID
   * @param callback - Todo一覧変更時に呼ばれるコールバック
   * @returns unsubscribe関数
   */
  subscribeTodos(
    userId: string,
    callback: (todos: Todo[]) => void,
    onError: (error: Error) => void
  ): () => void;
  
  /**
   * タグで絞り込まれたTodo一覧をリアルタイムで監視
   * @param userId - ユーザーID
   * @param tagIds - 絞り込むタグIDの配列（最大10個）
   * @param callback - Todo一覧変更時に呼ばれるコールバック
   * @returns unsubscribe関数
   */
  subscribeFilteredTodos(
    userId: string,
    tagIds: string[],
    callback: (todos: Todo[]) => void,
    onError: (error: Error) => void
  ): () => void;
  
  /**
   * 単一Todoをリアルタイムで監視
   * @param userId - ユーザーID
   * @param todoId - Todo ID
   * @param callback - Todo変更時に呼ばれるコールバック
   * @returns unsubscribe関数
   */
  subscribeTodo(
    userId: string,
    todoId: string,
    callback: (todo: Todo | null) => void,
    onError: (error: Error) => void
  ): () => void;
  
  /**
   * 新しいTodoを作成
   * @param userId - ユーザーID
   * @param input - Todo作成データ
   * @returns 作成されたTodoのID
   * @throws {ValidationError} バリデーションエラー
   * @throws {FirebaseError} Firestoreエラー
   */
  createTodo(userId: string, input: CreateTodoInput): Promise<string>;
  
  /**
   * Todoを更新
   * @param userId - ユーザーID
   * @param todoId - Todo ID
   * @param input - 更新データ
   * @throws {ValidationError} バリデーションエラー
   * @throws {FirebaseError} Firestoreエラー
   */
  updateTodo(userId: string, todoId: string, input: UpdateTodoInput): Promise<void>;
  
  /**
   * Todoを削除
   * @param userId - ユーザーID
   * @param todoId - Todo ID
   * @throws {FirebaseError} Firestoreエラー
   */
  deleteTodo(userId: string, todoId: string): Promise<void>;
}
```

### Validation

```typescript
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateTodoInput(input: CreateTodoInput | UpdateTodoInput): void {
  if ('title' in input && input.title !== undefined) {
    if (input.title.length < 1 || input.title.length > 100) {
      throw new ValidationError('タイトルは1文字以上100文字以内である必要があります');
    }
  }
  
  if ('description' in input && input.description !== undefined) {
    if (input.description.length > 1000) {
      throw new ValidationError('説明は1000文字以内である必要があります');
    }
  }
  
  if ('tagIds' in input && input.tagIds !== undefined) {
    if (input.tagIds.length > 20) {
      throw new ValidationError('タグは最大20個まで設定できます');
    }
  }
}
```

---

## Tag Service Contract

### Interface: `TagService`

```typescript
// src/services/tagService.ts

export interface CreateTagInput {
  name: string;
  color: TagColor;
}

export interface UpdateTagInput {
  name?: string;
  color?: TagColor;
}

export interface TagService {
  /**
   * ユーザーのタグ一覧をリアルタイムで監視
   * @param userId - ユーザーID
   * @param callback - タグ一覧変更時に呼ばれるコールバック
   * @returns unsubscribe関数
   */
  subscribeTags(
    userId: string,
    callback: (tags: Tag[]) => void,
    onError: (error: Error) => void
  ): () => void;
  
  /**
   * 新しいタグを作成
   * @param userId - ユーザーID
   * @param input - タグ作成データ
   * @returns 作成されたタグのID
   * @throws {ValidationError} バリデーションエラー
   * @throws {FirebaseError} Firestoreエラー
   */
  createTag(userId: string, input: CreateTagInput): Promise<string>;
  
  /**
   * タグを更新
   * @param userId - ユーザーID
   * @param tagId - タグID
   * @param input - 更新データ
   * @throws {ValidationError} バリデーションエラー
   * @throws {FirebaseError} Firestoreエラー
   */
  updateTag(userId: string, tagId: string, input: UpdateTagInput): Promise<void>;
  
  /**
   * タグを削除（関連するTodoからも削除）
   * @param userId - ユーザーID
   * @param tagId - タグID
   * @throws {FirebaseError} Firestoreエラー
   */
  deleteTag(userId: string, tagId: string): Promise<void>;
  
  /**
   * タグ名の重複チェック
   * @param userId - ユーザーID
   * @param name - チェックするタグ名
   * @param excludeTagId - 除外するタグID（更新時に使用）
   * @returns 重複している場合true
   */
  checkDuplicateName(userId: string, name: string, excludeTagId?: string): Promise<boolean>;
}
```

### Validation

```typescript
export function validateTagInput(input: CreateTagInput | UpdateTagInput): void {
  if ('name' in input && input.name !== undefined) {
    if (input.name.length < 1 || input.name.length > 30) {
      throw new ValidationError('タグ名は1文字以上30文字以内である必要があります');
    }
  }
  
  if ('color' in input && input.color !== undefined) {
    const validColors = Object.values(COLOR_PALETTE);
    if (!validColors.includes(input.color)) {
      throw new ValidationError('無効な色が指定されました');
    }
  }
}
```

---

## Error Handling Strategy

### Retry Logic

```typescript
export interface RetryOptions {
  maxAttempts: 3;
  baseDelay: 1000; // ms
  maxDelay: 4000; // ms
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 4000
  }
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // リトライ不可能なエラーは即座に失敗
      if (isNonRetryableError(error)) {
        throw error;
      }
      
      // 最後の試行の場合はリトライしない
      if (attempt === options.maxAttempts) {
        break;
      }
      
      // Exponential backoff
      const delay = Math.min(
        options.baseDelay * Math.pow(2, attempt - 1),
        options.maxDelay
      );
      await sleep(delay);
    }
  }
  
  throw lastError!;
}

function isNonRetryableError(error: any): boolean {
  if (error.code) {
    // Permission denied, not found等はリトライ不要
    return ['permission-denied', 'not-found', 'invalid-argument'].includes(error.code);
  }
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Toast Notification Contract

```typescript
export interface ToastService {
  success(message: string): void;
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
}

export function handleServiceError(error: Error, toast: ToastService): void {
  if (error instanceof ValidationError) {
    toast.warning(error.message);
  } else if (error.code === 'permission-denied') {
    toast.error('この操作を実行する権限がありません');
  } else if (error.code === 'unavailable') {
    toast.error('ネットワークエラーが発生しました。再試行中...');
  } else {
    toast.error('エラーが発生しました。しばらくしてから再度お試しください');
    console.error('Service error:', error);
  }
}
```

---

## Real-time Subscription Patterns

### Pattern 1: Auto-unsubscribe with useEffect

```typescript
function useTodos(userId: string | null) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!userId) {
      setTodos([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const unsubscribe = todoService.subscribeTodos(
      userId,
      (newTodos) => {
        setTodos(newTodos);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [userId]);
  
  return { todos, loading, error };
}
```

### Pattern 2: Mutation with Optimistic Updates

```typescript
async function useCreateTodo() {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();
  
  const createTodo = async (input: CreateTodoInput) => {
    if (!user) throw new Error('Not authenticated');
    
    setIsCreating(true);
    try {
      const todoId = await withRetry(() => 
        todoService.createTodo(user.uid, input)
      );
      toast.success('Todoを作成しました');
      return todoId;
    } catch (error) {
      handleServiceError(error as Error, toast);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };
  
  return { createTodo, isCreating };
}
```

---

## Performance Contracts

### Response Time Goals

| Operation | Target | Measurement |
|-----------|--------|-------------|
| Real-time sync | <100ms | onSnapshot callback latency |
| Todo create | <500ms | addDoc completion time |
| Todo update | <500ms | updateDoc completion time |
| Todo delete | <500ms | deleteDoc completion time |
| Tag delete (cascade) | <2s | batch.commit completion time |
| Initial load | <3s | First meaningful paint |

### Monitoring

```typescript
export interface PerformanceMetrics {
  logSyncLatency(latency: number): void;
  logOperationDuration(operation: string, duration: number): void;
  logError(operation: string, error: Error): void;
}

// Firebase Performance Monitoring integration
export function createPerformanceMonitor(): PerformanceMetrics {
  return {
    logSyncLatency(latency) {
      const trace = performance.trace('firestore_sync');
      trace.putMetric('latency_ms', latency);
      trace.stop();
    },
    logOperationDuration(operation, duration) {
      const trace = performance.trace(`firestore_${operation}`);
      trace.putMetric('duration_ms', duration);
      trace.stop();
    },
    logError(operation, error) {
      analytics.logEvent('firestore_error', {
        operation,
        error_code: error.code,
        error_message: error.message
      });
    }
  };
}
```

---

## Testing Contracts

### Service Test Interface

```typescript
// tests/services/todoService.test.ts

describe('TodoService', () => {
  let mockFirestore: MockFirestore;
  let todoService: TodoService;
  let userId: string;
  
  beforeEach(() => {
    mockFirestore = createMockFirestore();
    todoService = new FirestoreTodoService(mockFirestore);
    userId = 'test-user-123';
  });
  
  describe('createTodo', () => {
    it('should create todo with valid input', async () => {
      const input: CreateTodoInput = {
        title: 'Test Todo',
        description: 'Test Description',
        tagIds: []
      };
      
      const todoId = await todoService.createTodo(userId, input);
      
      expect(todoId).toBeDefined();
      expect(mockFirestore.collection).toHaveBeenCalledWith(`users/${userId}/todos`);
    });
    
    it('should throw ValidationError for title > 100 chars', async () => {
      const input: CreateTodoInput = {
        title: 'a'.repeat(101)
      };
      
      await expect(todoService.createTodo(userId, input))
        .rejects.toThrow(ValidationError);
    });
  });
  
  describe('subscribeTodos', () => {
    it('should call callback with todos on snapshot', (done) => {
      const mockTodos: Todo[] = [
        { id: 'todo1', title: 'Test', tagIds: [], createdAt: new Date(), updatedAt: new Date(), userId }
      ];
      
      mockFirestore.setMockSnapshot(mockTodos);
      
      todoService.subscribeTodos(
        userId,
        (todos) => {
          expect(todos).toEqual(mockTodos);
          done();
        },
        (error) => done(error)
      );
    });
  });
});
```
