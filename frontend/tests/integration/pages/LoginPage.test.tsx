import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../../../src/pages/LoginPage';
import { AuthProvider } from '../../../src/contexts/AuthContext';

// Mock AuthContext
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithGoogle = vi.fn();

vi.mock('../../../src/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
    loading: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock MainLayout and Toast
vi.mock('../../../src/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../../../src/components/ui/Toast', () => ({
  Toast: () => <div>Toast</div>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: 'ログイン' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  it('switches to signup form when toggle is clicked', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const toggleButton = screen.getByText('アカウントをお持ちでないですか？サインアップ');
    fireEvent.click(toggleButton);

    expect(screen.getByRole('heading', { name: 'アカウント作成' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'アカウント作成' })).toBeInTheDocument();
    expect(screen.getByText('既にアカウントをお持ちですか？ログイン')).toBeInTheDocument();
  });

  it('calls signIn when login form is submitted', async () => {
    mockSignIn.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const emailInput = screen.getByPlaceholderText('メールアドレス');
    const passwordInput = screen.getByPlaceholderText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'ログイン' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('calls signUp when signup form is submitted', async () => {
    mockSignUp.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // Switch to signup
    const toggleButton = screen.getByText('アカウントをお持ちでないですか？サインアップ');
    fireEvent.click(toggleButton);

    const emailInput = screen.getByPlaceholderText('メールアドレス');
    const passwordInput = screen.getByPlaceholderText('パスワード');
    const submitButton = screen.getByRole('button', { name: 'アカウント作成' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('calls signInWithGoogle when Google button is clicked', async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined);

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const googleButton = screen.getByRole('button', { name: 'Googleでログイン' });
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it('does not submit form when email or password is empty', () => {
    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    const submitButton = screen.getByRole('button', { name: 'ログイン' });
    fireEvent.click(submitButton);

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(mockSignUp).not.toHaveBeenCalled();
  });
});