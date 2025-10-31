import { analyticsService } from '../services/analyticsService';

export const handleAuthError = (error: any): string => {
  switch (error.code) {
    case 'auth/user-not-found':
      return '指定されたメールアドレスのユーザーが見つかりません。入力内容をご確認ください。';
    case 'auth/wrong-password':
      return 'パスワードが正しくありません。再度ご確認ください。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に登録されています。ログイン画面からサインインしてください。';
    case 'auth/weak-password':
      return '安全のため、より強力なパスワードを設定してください（6文字以上推奨）。';
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。正しい形式で入力してください。';
    case 'auth/too-many-requests':
      return '短時間に多数のリクエストが検出されました。しばらく待ってから再度お試しください。';
    default:
      return '認証に失敗しました。ネットワーク状況や入力内容をご確認ください。';
  }
};

export const handleServiceError = (error: any): string => {
  if (error.code === 'permission-denied') {
    return 'この操作を行う権限がありません。ログイン状態やアクセス権限をご確認ください。';
  }
  if (error.code === 'not-found') {
    return '指定されたデータが見つかりません。削除済みや入力ミスの可能性があります。';
  }
  if (error.code === 'already-exists') {
    return '同じ内容のデータが既に存在します。重複していないかご確認ください。';
  }
  if (error.code === 'resource-exhausted') {
    return '利用可能なリソースの上限に達しました。しばらく待ってから再度お試しください。';
  }
  return 'サービスに接続できませんでした。ネットワーク状況やサーバー状態をご確認ください。';
};

export const handleError = (error: any): string => {
  // Track error in analytics
  const errorType = error.code || 'unknown_error';
  const errorMessage = error.message || 'Unknown error occurred';
  analyticsService.trackError(errorType, errorMessage);

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
    // よくあるパターンを日本語化
    if (error.message.includes('userIdが指定されていません')) {
      return 'ユーザー情報が取得できませんでした。再度ログインしてください。';
    }
    if (error.message.includes('タグ名が重複しています')) {
      return '同じ名前のタグが既に存在します。別の名前を入力してください。';
    }
    if (error.message.includes('Todoの作成に失敗しました')) {
      return 'Todoの作成に失敗しました。ネットワーク状況や入力内容をご確認ください。';
    }
    if (error.message.includes('Todoの更新に失敗しました')) {
      return 'Todoの更新に失敗しました。再度お試しください。';
    }
    if (error.message.includes('Todoの削除に失敗しました')) {
      return 'Todoの削除に失敗しました。再度お試しください。';
    }
    if (error.message.includes('Todo一覧の取得に失敗しました')) {
      return 'Todo一覧の取得に失敗しました。ネットワーク状況をご確認ください。';
    }
    if (error.message.includes('Todo一覧の監視設定に失敗しました')) {
      return 'Todo一覧のリアルタイム監視の設定に失敗しました。再度お試しください。';
    }
    if (error.message.includes('フィルタリングされたTodo一覧の取得に失敗しました')) {
      return 'タグで絞り込んだTodo一覧の取得に失敗しました。ネットワーク状況をご確認ください。';
    }
    if (error.message.includes('フィルタリングされたTodo一覧の監視設定に失敗しました')) {
      return 'タグ絞り込みのリアルタイム監視の設定に失敗しました。再度お試しください。';
    }
    if (error.message.includes('Todoの状態変更に失敗しました')) {
      return 'Todoの状態変更に失敗しました。再度お試しください。';
    }
    return error.message;
  }

  // 不明なエラーの場合
  return '予期しないエラーが発生しました。時間をおいて再度お試しください。';
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