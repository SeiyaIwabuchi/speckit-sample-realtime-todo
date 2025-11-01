import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';
import { handleAuthError } from '../utils/errorHandling';
import { toastService } from '../services/toastService';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      console.log('Auth state changed:', authUser ? 'User logged in' : 'User logged out', authUser);
      setUser(authUser);
      setLoading(false);

      // Set user for analytics tracking
      if (authUser) {
        await analyticsService.setUser(authUser.id, {
          email: authUser.email,
          signup_date: authUser.createdAt.toISOString()
        });
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signUpWithEmail(email, password);
      toastService.success('アカウントが作成されました');
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toastService.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.signInWithEmail(email, password);
      toastService.success('ログインしました');
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toastService.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authService.signInWithGoogle();
      toastService.success('Googleアカウントでログインしました');
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toastService.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      toastService.info('ログアウトしました');
    } catch (error: any) {
      toastService.error('ログアウトに失敗しました');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};