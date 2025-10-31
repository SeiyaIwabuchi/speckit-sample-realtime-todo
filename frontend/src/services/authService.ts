import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import { analyticsService } from './analyticsService';
import { User } from '../types/user';

export interface AuthService {
  signUpWithEmail(email: string, password: string): Promise<User>;
  signInWithEmail(email: string, password: string): Promise<User>;
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}

class FirebaseAuthService implements AuthService {
  private googleProvider = new GoogleAuthProvider();

  constructor() {
    // Google OAuthのポップアップウィンドウの問題を解決
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  async signUpWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = this.mapFirebaseUserToUser(result.user);
      await analyticsService.trackSignup('email');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = this.mapFirebaseUserToUser(result.user);
      await analyticsService.trackLogin('email');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const user = this.mapFirebaseUserToUser(result.user);
      await analyticsService.trackLogin('google');
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      await analyticsService.trackLogout();
    } catch (error) {
      throw error;
    }
  }

  getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser;
    return firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null;
      callback(user);
    });
  }

  private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
      updatedAt: new Date(firebaseUser.metadata.lastSignInTime || Date.now()),
    };
  }
}

export const authService = new FirebaseAuthService();