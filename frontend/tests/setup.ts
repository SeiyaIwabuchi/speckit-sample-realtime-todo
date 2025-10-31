import '@testing-library/jest-dom'
import { vi } from 'vitest';
import React from 'react';

// Firebase Auth mocks
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  })),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: class {
    setCustomParameters = vi.fn();
  },
  signInWithPopup: vi.fn(),
}));

// Firebase Firestore mocks
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(),
  getDocs: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ toDate: () => new Date() })),
    fromDate: vi.fn((date) => ({ toDate: () => date })),
  },
}));

// Firebase Analytics mocks
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  logEvent: vi.fn(),
  setUserProperties: vi.fn(),
  setUserId: vi.fn(),
  isSupported: vi.fn(() => Promise.resolve(true)),
}));

// Firebase Performance mocks
vi.mock('firebase/performance', () => ({
  getPerformance: vi.fn(() => ({})),
  trace: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    putAttribute: vi.fn(),
    putMetric: vi.fn(),
  })),
}));

// Firebase App mocks
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

// Mock useAuth hook
vi.mock('../../../src/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user1', email: 'test@example.com' },
    loading: false,
    error: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  })),
}));

// Mock analyticsService
vi.mock('../../../src/services/analyticsService', () => ({
  analyticsService: {
    trackTagCreated: vi.fn(),
    trackTagUpdated: vi.fn(),
    trackTagDeleted: vi.fn(),
  },
}));

// Mock tagService
vi.mock('../../../src/services/tagService', () => ({
  tagService: {
    subscribeTags: vi.fn(() => vi.fn()), // Return unsubscribe function directly
    createTag: vi.fn(),
    updateTag: vi.fn(),
    deleteTag: vi.fn(),
  },
}));

// Mock Headless UI components
vi.mock('@headlessui/react', () => ({
  Dialog: vi.fn(({ children }) => children),
  DialogPanel: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  DialogTitle: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  DialogBackdrop: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  Transition: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  TransitionChild: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  Combobox: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  ComboboxButton: vi.fn(({ children, ...props }) => React.createElement('button', props, children)),
  ComboboxInput: vi.fn((props) => React.createElement('input', props)),
  ComboboxOptions: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  ComboboxOption: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  Listbox: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  ListboxButton: vi.fn(({ children, ...props }) => React.createElement('button', props, children)),
  ListboxOptions: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
  ListboxOption: vi.fn(({ children, ...props }) => React.createElement('div', props, children)),
}));