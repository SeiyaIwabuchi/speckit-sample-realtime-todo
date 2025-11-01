import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../../src/services/authService';

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({
    setCustomParameters: vi.fn(),
  })),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()), // Return unsubscribe function
}));

vi.mock('../firebase', () => ({
  auth: {},
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUpWithEmail', () => {
    it('should create user with email and password', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/photo.jpg',
        metadata: {
          creationTime: '2025-01-01T00:00:00Z',
          lastSignInTime: '2025-01-01T00:00:00Z',
        },
      };

      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
      (createUserWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

      const result = await authService.signUpWithEmail('test@example.com', 'password123');

      expect(result.id).toBe('user123');
      expect(result.email).toBe('test@example.com');
      expect(result.displayName).toBe('Test User');
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
    });
  });

  describe('signInWithEmail', () => {
    it('should sign in user with email and password', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
        metadata: {
          creationTime: '2025-01-01T00:00:00Z',
          lastSignInTime: '2025-01-01T00:00:00Z',
        },
      };

      const { signInWithEmailAndPassword } = await import('firebase/auth');
      (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

      const result = await authService.signInWithEmail('test@example.com', 'password123');

      expect(result.id).toBe('user123');
      expect(result.email).toBe('test@example.com');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
    });
  });

  describe('signInWithGoogle', () => {
    it('should sign in user with Google', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@gmail.com',
        displayName: 'Google User',
        metadata: {
          creationTime: '2025-01-01T00:00:00Z',
          lastSignInTime: '2025-01-01T00:00:00Z',
        },
      };

      const { signInWithPopup } = await import('firebase/auth');
      (signInWithPopup as any).mockResolvedValue({ user: mockUser });

      const result = await authService.signInWithGoogle();

      expect(result.id).toBe('user123');
      expect(result.email).toBe('test@gmail.com');
      expect(signInWithPopup).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should sign out user', async () => {
      const { signOut } = await import('firebase/auth');
      (signOut as any).mockResolvedValue(undefined);

      await expect(authService.signOut()).resolves.toBeUndefined();
      expect(signOut).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user is signed in', () => {
      const result = authService.getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('onAuthStateChanged', () => {
    it('should register auth state change listener', () => {
      const callback = vi.fn();

      const unsubscribe = authService.onAuthStateChanged(callback);

      expect(typeof unsubscribe).toBe('function');
    });
  });
});