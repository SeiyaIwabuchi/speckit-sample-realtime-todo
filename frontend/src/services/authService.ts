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
      return this.mapFirebaseUserToUser(result.user);
    } catch (error) {
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUserToUser(result.user);
    } catch (error) {
      throw error;
    }
  }

  async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      return this.mapFirebaseUserToUser(result.user);
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
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