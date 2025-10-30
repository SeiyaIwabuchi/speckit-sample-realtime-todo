export const handleAuthError = (error: any): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません';
    case 'auth/wrong-password':
      return 'パスワードが間違っています';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています';
    case 'auth/weak-password':
      return 'パスワードが弱すぎます';
    case 'auth/invalid-email':
      return '無効なメールアドレスです';
    case 'auth/too-many-requests':
      return 'リクエストが多すぎます。しばらく待ってから再度お試しください';
    default:
      return '認証エラーが発生しました';
  }
};

export const handleServiceError = (error: any): string => {
  if (error.code === 'permission-denied') {
    return 'アクセス権限がありません';
  }
  if (error.code === 'not-found') {
    return 'データが見つかりません';
  }
  if (error.code === 'already-exists') {
    return 'データが既に存在します';
  }
  if (error.code === 'resource-exhausted') {
    return 'リソース制限に達しました';
  }
  return 'サービスエラーが発生しました';
};

export const handleError = (error: any): string => {
  // Firebaseエラーの場合
  if (error.code) {
    // 認証エラーの場合
    if (error.code.startsWith('auth/')) {
      return handleAuthError(error);
    }
    // サービスエラーの場合
    return handleServiceError(error);
  }

  // 一般的なエラーの場合
  if (error.message) {
    return error.message;
  }

  // 不明なエラーの場合
  return '予期しないエラーが発生しました';
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // ネットワークエラーや一時的なエラーの場合のみリトライ
      if (
        error.code === 'unavailable' ||
        error.code === 'deadline-exceeded' ||
        error.code === 'resource-exhausted'
      ) {
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          continue;
        }
      }

      // リトライしないエラーの場合は即座に失敗
      throw error;
    }
  }

  throw lastError;
};