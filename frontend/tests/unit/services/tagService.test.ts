import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { tagService } from '../../../src/services/tagService';
import { Tag } from '../../../src/types/tag';

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
  getDocs: vi.fn(),
  writeBatch: vi.fn(),
  serverTimestamp: vi.fn(),
}));

// Firebase設定のモック
vi.mock('../../../src/services/firebase', () => ({
  db: {},
}));

describe('TagService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createTag', () => {
    it('should create a tag with valid data', async () => {
      // Arrange
      const tagData = {
        name: 'Work',
        color: '#ff0000',
        userId: 'user123',
      };

      const mockDocRef = { id: 'tag123' };
      const mockAddDoc = vi.fn().mockResolvedValue(mockDocRef);
      const mockCollection = vi.fn().mockReturnValue({});
      const mockQuery = vi.fn().mockReturnValue({});
      const mockGetDocs = vi.fn().mockResolvedValue({ empty: true, docs: [] });

      vi.mocked(collection).mockImplementation(mockCollection);
      vi.mocked(query).mockImplementation(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(getDocs).mockImplementation(mockGetDocs);
      vi.mocked(addDoc).mockImplementation(mockAddDoc);
      vi.mocked(serverTimestamp).mockReturnValue({} as any);

      // Act
      const result = await tagService.createTag(tagData);

      // Assert
      expect(result).toEqual({
        id: 'tag123',
        name: 'Work',
        color: '#ff0000',
        userId: 'user123',
        createdAt: expect.any(Date),
      });
      expect(addDoc).toHaveBeenCalledWith({}, {
        name: 'Work',
        color: '#ff0000',
        userId: 'user123',
        createdAt: {} as any,
        updatedAt: {} as any,
      });
    });

    it('should throw error when tag name already exists', async () => {
      // Arrange
      const tagData = {
        name: 'Work',
        color: '#ff0000',
        userId: 'user123',
      };

      const mockCollection = vi.fn().mockReturnValue({});
      const mockQuery = vi.fn().mockReturnValue({});
      const mockGetDocs = vi.fn().mockResolvedValue({
        empty: false,
        docs: [{ id: 'existing-tag', data: () => ({}) }]
      });

      vi.mocked(collection).mockImplementation(mockCollection);
      vi.mocked(query).mockImplementation(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(getDocs).mockImplementation(mockGetDocs);

      // Act & Assert
      await expect(tagService.createTag(tagData)).rejects.toThrow('タグ名が重複しています');
    });
  });

  describe('updateTag', () => {
    it('should update a tag with valid data', async () => {
      // Arrange
      const tagId = 'tag123';
      const updates = {
        name: 'Updated Work',
        color: '#00ff00',
        userId: 'user123',
      };

      const mockDoc = vi.fn().mockReturnValue({});
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
      const mockCollection = vi.fn().mockReturnValue({});
      const mockQuery = vi.fn().mockReturnValue({});
      const mockGetDocs = vi.fn().mockResolvedValue({
        forEach: vi.fn(),
        docs: []
      });
      const mockWriteBatch = vi.fn().mockReturnValue({
        update: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      });

      vi.mocked(doc).mockImplementation(mockDoc);
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc);
      vi.mocked(collection).mockImplementation(mockCollection);
      vi.mocked(query).mockImplementation(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(getDocs).mockImplementation(mockGetDocs);
      vi.mocked(serverTimestamp).mockReturnValue({} as any);
      vi.mocked(writeBatch).mockImplementation(mockWriteBatch);

      // Act
      await tagService.updateTag(tagId, updates);

      // Assert
      expect(updateDoc).toHaveBeenCalledWith({}, {
        name: 'Updated Work',
        color: '#00ff00',
        userId: 'user123',
        updatedAt: {} as any,
      });
    });

    it('should throw error when updating to duplicate name', async () => {
      // Arrange
      const tagId = 'tag123';
      const updates = {
        name: 'Existing Name',
        userId: 'user123',
      };

      const mockCollection = vi.fn().mockReturnValue({});
      const mockQuery = vi.fn().mockReturnValue({});
      const mockGetDocs = vi.fn().mockResolvedValue({
        empty: false,
        docs: [
          { id: 'other-tag', data: () => ({}) },
          { id: tagId, data: () => ({}) }
        ]
      });

      vi.mocked(collection).mockImplementation(mockCollection);
      vi.mocked(query).mockImplementation(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(getDocs).mockImplementation(mockGetDocs);

      // Act & Assert
      await expect(tagService.updateTag(tagId, updates)).rejects.toThrow('タグ名が重複しています');
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag and remove it from todos', async () => {
      // Arrange
      const tagId = 'tag123';
      const userId = 'user123';

      const mockDoc = vi.fn().mockReturnValue({});
      const mockDeleteDoc = vi.fn().mockResolvedValue(undefined);
      const mockCollection = vi.fn().mockReturnValue({});
      const mockQuery = vi.fn().mockReturnValue({});
      const mockGetDocs = vi.fn().mockResolvedValue({
        docs: [
          {
            ref: {},
            data: () => ({ tagIds: ['tag123', 'tag456'] })
          }
        ],
        forEach: vi.fn((callback) => {
          callback({
            ref: {},
            data: () => ({ tagIds: ['tag123', 'tag456'] })
          });
        })
      });
      const mockWriteBatch = vi.fn().mockReturnValue({
        update: vi.fn(),
        commit: vi.fn().mockResolvedValue(undefined),
      });

      vi.mocked(doc).mockImplementation(mockDoc);
      vi.mocked(deleteDoc).mockImplementation(mockDeleteDoc);
      vi.mocked(collection).mockImplementation(mockCollection);
      vi.mocked(query).mockImplementation(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(getDocs).mockImplementation(mockGetDocs);
      vi.mocked(writeBatch).mockImplementation(mockWriteBatch);

      // Act
      await tagService.deleteTag(tagId, userId);

      // Assert
      expect(deleteDoc).toHaveBeenCalledWith({});
      expect(writeBatch).toHaveBeenCalledWith({});
    });
  });

  describe('subscribeTags', () => {
    it('should setup subscription and return unsubscribe function', () => {
      // Arrange
      const userId = 'user123';
      const mockCallback = vi.fn();
      const mockUnsubscribe = vi.fn();

      const mockCollection = vi.fn().mockReturnValue({});
      const mockQuery = vi.fn().mockReturnValue({});
      const mockOnSnapshot = vi.fn().mockImplementation((_query, callback) => {
        // Simulate snapshot
        const mockSnapshot = {
          docs: [
            {
              id: 'tag1',
              data: () => ({
                name: 'Work',
                color: '#ff0000',
                userId: 'user123',
                createdAt: { toDate: () => new Date() }
              })
            }
          ]
        };
        callback(mockSnapshot);
        return mockUnsubscribe;
      });

      vi.mocked(collection).mockImplementation(mockCollection);
      vi.mocked(query).mockImplementation(mockQuery);
      vi.mocked(where).mockReturnValue({} as any);
      vi.mocked(onSnapshot).mockImplementation(mockOnSnapshot);

      // Act
      const unsubscribe = tagService.subscribeTags(userId, mockCallback);

      // Assert
      expect(onSnapshot).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalledWith([
        {
          id: 'tag1',
          name: 'Work',
          color: '#ff0000',
          userId: 'user123',
          createdAt: expect.any(Date),
        }
      ]);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
