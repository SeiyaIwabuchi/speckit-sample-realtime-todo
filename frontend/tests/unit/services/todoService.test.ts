import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { TodoService } from '../../../src/services/todoService';
import { CreateTodoData, UpdateTodoData } from '../../../src/types/todo';

// Firebase Firestoreのモック
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
}));

// Firebase設定のモック
vi.mock('../../../src/services/firebase', () => ({
  db: {},
}));

describe('TodoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createTodo', () => {
    it('should create a todo with valid data', async () => {
      // Arrange
      const userId = 'user123';
      const todoData: CreateTodoData = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const mockDocRef = { id: 'todo123' };
      const mockAddDoc = vi.fn().mockResolvedValue(mockDocRef);
      vi.mocked(addDoc).mockImplementation(mockAddDoc);
      vi.mocked(collection).mockReturnValue({} as any);

      // Act
      const result = await TodoService.createTodo(userId, todoData);

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'todos');
      expect(mockAddDoc).toHaveBeenCalledWith({} as any, {
        title: 'Test Todo',
        description: 'Test Description',
        userId: 'user123',
        completed: false,
        tagIds: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result).toEqual({
        id: 'todo123',
        title: 'Test Todo',
        description: 'Test Description',
        userId: 'user123',
        completed: false,
        tagIds: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should create a todo with tagIds', async () => {
      // Arrange
      const userId = 'user123';
      const todoData: CreateTodoData = {
        title: 'Test Todo',
        description: 'Test Description',
        tagIds: ['tag1', 'tag2'],
      };

      const mockDocRef = { id: 'todo123' };
      const mockAddDoc = vi.fn().mockResolvedValue(mockDocRef);
      vi.mocked(addDoc).mockImplementation(mockAddDoc);
      vi.mocked(collection).mockReturnValue({} as any);

      // Act
      const result = await TodoService.createTodo(userId, todoData);

      // Assert
      expect(mockAddDoc).toHaveBeenCalledWith({} as any, expect.objectContaining({
        tagIds: ['tag1', 'tag2'],
      }));
      expect(result.tagIds).toEqual(['tag1', 'tag2']);
    });

    it('should throw error when Firestore operation fails', async () => {
      // Arrange
      const userId = 'user123';
      const todoData: CreateTodoData = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const mockError = new Error('Firestore error');
      vi.mocked(addDoc).mockRejectedValue(mockError);
      vi.mocked(collection).mockReturnValue({} as any);

      // Act & Assert
      await expect(TodoService.createTodo(userId, todoData)).rejects.toThrow('Todoの作成に失敗しました');
    });
  });

  describe('subscribeToTodos', () => {
    it('should setup subscription with correct query', () => {
      // Arrange
      const userId = 'user123';
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockQuery = {} as any;
      const mockOnSnapshot = vi.fn().mockReturnValue(mockUnsubscribe);

      vi.mocked(query).mockReturnValue(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Act
      const unsubscribe = TodoService.subscribeToTodos(userId, mockCallback);

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'todos');
      expect(where).toHaveBeenCalledWith('userId', '==', userId);
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(query).toHaveBeenCalledWith({} as any, {} as any, {} as any);
      expect(onSnapshot).toHaveBeenCalledWith(mockQuery, expect.any(Function), expect.any(Function));
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call callback with todos when snapshot changes', () => {
      // Arrange
      const userId = 'user123';
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockDoc1 = {
        id: 'todo1',
        data: () => ({
          title: 'Todo 1',
          description: 'Description 1',
          userId: 'user123',
          completed: false,
          tagIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      };

      const mockQuerySnapshot = {
        forEach: vi.fn((callback) => {
          callback(mockDoc1);
        }),
      };

      let snapshotCallback: (snapshot: any) => void;
      const mockOnSnapshot = vi.fn().mockImplementation((query, callback) => {
        snapshotCallback = callback;
        return mockUnsubscribe;
      });

      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Act
      TodoService.subscribeToTodos(userId, mockCallback);
      snapshotCallback!(mockQuerySnapshot);

      // Assert
      expect(mockCallback).toHaveBeenCalledWith([
        {
          id: 'todo1',
          title: 'Todo 1',
          description: 'Description 1',
          userId: 'user123',
          completed: false,
          tagIds: [],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });

    it('should throw error when subscription setup fails', () => {
      // Arrange
      const userId = 'user123';
      const mockCallback = vi.fn();

      vi.mocked(collection).mockImplementation(() => {
        throw new Error('Collection error');
      });

      // Act & Assert
      expect(() => TodoService.subscribeToTodos(userId, mockCallback)).toThrow('Todo一覧の監視設定に失敗しました');
    });

    it('should handle snapshot listener errors gracefully', () => {
      // Arrange
      const userId = 'user123';
      const mockCallback = vi.fn();

      let errorCallback: (error: Error) => void;
      const mockOnSnapshot = vi.fn().mockImplementation((query, successCallback, errorCallbackParam) => {
        errorCallback = errorCallbackParam;
        return vi.fn();
      });

      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Mock console.error to avoid console output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert - Error should be thrown when snapshot listener fails
      TodoService.subscribeToTodos(userId, mockCallback);
      const testError = new Error('Snapshot error');
      expect(() => errorCallback!(testError)).toThrow('Todo一覧の取得に失敗しました');

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error subscribing to todos:', testError);
      expect(mockCallback).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateTodo', () => {
    it('should update todo with valid data', async () => {
      // Arrange
      const todoId = 'todo123';
      const updateData: UpdateTodoData = {
        title: 'Updated Todo',
        completed: true,
      };

      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc);
      vi.mocked(doc).mockReturnValue({} as any);

      // Act
      await TodoService.updateTodo(todoId, updateData);

      // Assert
      expect(doc).toHaveBeenCalledWith({}, 'todos', todoId);
      expect(mockUpdateDoc).toHaveBeenCalledWith({} as any, {
        title: 'Updated Todo',
        completed: true,
        updatedAt: expect.any(Date),
      });
    });

    it('should update todo with partial data', async () => {
      // Arrange
      const todoId = 'todo123';
      const updateData: UpdateTodoData = {
        completed: false,
      };

      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc);
      vi.mocked(doc).mockReturnValue({} as any);

      // Act
      await TodoService.updateTodo(todoId, updateData);

      // Assert
      expect(mockUpdateDoc).toHaveBeenCalledWith({} as any, {
        completed: false,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw error when Firestore operation fails', async () => {
      // Arrange
      const todoId = 'todo123';
      const updateData: UpdateTodoData = {
        title: 'Updated Todo',
      };

      const mockError = new Error('Firestore error');
      vi.mocked(updateDoc).mockRejectedValue(mockError);
      vi.mocked(doc).mockReturnValue({} as any);

      // Act & Assert
      await expect(TodoService.updateTodo(todoId, updateData)).rejects.toThrow('Todoの更新に失敗しました');
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo successfully', async () => {
      // Arrange
      const todoId = 'todo123';

      const mockDeleteDoc = vi.fn().mockResolvedValue(undefined);
      vi.mocked(deleteDoc).mockImplementation(mockDeleteDoc);
      vi.mocked(doc).mockReturnValue({} as any);

      // Act
      await TodoService.deleteTodo(todoId);

      // Assert
      expect(doc).toHaveBeenCalledWith({}, 'todos', todoId);
      expect(mockDeleteDoc).toHaveBeenCalledWith({} as any);
    });

    it('should throw error when Firestore operation fails', async () => {
      // Arrange
      const todoId = 'todo123';

      const mockError = new Error('Firestore error');
      vi.mocked(deleteDoc).mockRejectedValue(mockError);
      vi.mocked(doc).mockReturnValue({} as any);

      // Act & Assert
      await expect(TodoService.deleteTodo(todoId)).rejects.toThrow('Todoの削除に失敗しました');
    });
  });

  describe('subscribeToFilteredTodos', () => {
    it('should setup subscription with tag filter using array-contains-any', () => {
      // Arrange
      const userId = 'user123';
      const tagIds = ['tag1', 'tag2'];
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockQuery = {} as any;
      const mockOnSnapshot = vi.fn().mockReturnValue(mockUnsubscribe);

      vi.mocked(query).mockReturnValue(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Act
      const unsubscribe = TodoService.subscribeToFilteredTodos(userId, tagIds, mockCallback);

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'todos');
      expect(where).toHaveBeenNthCalledWith(1, 'userId', '==', userId);
      expect(where).toHaveBeenNthCalledWith(2, 'tagIds', 'array-contains-any', tagIds);
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(query).toHaveBeenCalledWith({} as any, {} as any, {} as any, {} as any);
      expect(onSnapshot).toHaveBeenCalledWith(mockQuery, expect.any(Function), expect.any(Function));
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should setup subscription without tag filter when tagIds is empty', () => {
      // Arrange
      const userId = 'user123';
      const tagIds: string[] = [];
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockQuery = {} as any;
      const mockOnSnapshot = vi.fn().mockReturnValue(mockUnsubscribe);

      vi.mocked(query).mockReturnValue(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Act
      const unsubscribe = TodoService.subscribeToFilteredTodos(userId, tagIds, mockCallback);

      // Assert
      expect(collection).toHaveBeenCalledWith({}, 'todos');
      expect(where).toHaveBeenCalledWith('userId', '==', userId);
      expect(where).toHaveBeenCalledTimes(1); // Only userId filter, no tag filter
      expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
      expect(query).toHaveBeenCalledWith({} as any, {} as any, {} as any);
      expect(onSnapshot).toHaveBeenCalledWith(mockQuery, expect.any(Function), expect.any(Function));
      expect(unsubscribe).toBe(mockUnsubscribe);
    });

    it('should call callback with filtered todos when snapshot changes', () => {
      // Arrange
      const userId = 'user123';
      const tagIds = ['tag1'];
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockDoc1 = {
        id: 'todo1',
        data: () => ({
          title: 'Todo 1',
          description: 'Description 1',
          userId: 'user123',
          completed: false,
          tagIds: ['tag1', 'tag2'],
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      };

      const mockQuerySnapshot = {
        forEach: vi.fn((callback) => {
          callback(mockDoc1);
        }),
      };

      let snapshotCallback: (snapshot: any) => void;
      const mockOnSnapshot = vi.fn().mockImplementation((query, callback) => {
        snapshotCallback = callback;
        return mockUnsubscribe;
      });

      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Act
      TodoService.subscribeToFilteredTodos(userId, tagIds, mockCallback);
      snapshotCallback!(mockQuerySnapshot);

      // Assert
      expect(mockCallback).toHaveBeenCalledWith([
        {
          id: 'todo1',
          title: 'Todo 1',
          description: 'Description 1',
          userId: 'user123',
          completed: false,
          tagIds: ['tag1', 'tag2'],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });

    it('should throw error when subscription setup fails', () => {
      // Arrange
      const userId = 'user123';
      const tagIds = ['tag1'];
      const mockCallback = vi.fn();

      vi.mocked(collection).mockImplementation(() => {
        throw new Error('Collection error');
      });

      // Act & Assert
      expect(() => TodoService.subscribeToFilteredTodos(userId, tagIds, mockCallback)).toThrow('フィルタリングされたTodo一覧の監視設定に失敗しました');
    });

    it('should handle snapshot listener errors gracefully', () => {
      // Arrange
      const userId = 'user123';
      const tagIds = ['tag1'];
      const mockCallback = vi.fn();

      let errorCallback: (error: Error) => void;
      const mockOnSnapshot = vi.fn().mockImplementation((query, successCallback, errorCallbackParam) => {
        errorCallback = errorCallbackParam;
        return vi.fn();
      });

      vi.mocked(query).mockReturnValue({} as any);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(orderBy).mockReturnValue({} as any);
      vi.mocked(collection).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Mock console.error to avoid console output during test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert - Error should be thrown when snapshot listener fails
      TodoService.subscribeToFilteredTodos(userId, tagIds, mockCallback);
      const testError = new Error('Snapshot error');
      expect(() => errorCallback!(testError)).toThrow('フィルタリングされたTodo一覧の取得に失敗しました');

      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error subscribing to filtered todos:', testError);
      expect(mockCallback).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });});