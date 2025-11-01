# Research: リアルタイムTodo管理

**Feature**: 001-realtime-todo-crud  
**Date**: 2025-10-29  
**Phase**: 0 - Research & Technology Selection

## Overview

リアルタイムTodo管理アプリケーションの実装に向けた技術選定と設計パターンの調査。Firebase（Firestore + Authentication）を中心としたアーキテクチャで、TypeScriptとモダンなフロントエンドフレームワークを使用。

## Technology Decisions

### 1. Frontend Framework Selection

**Decision**: React 18 with TypeScript

**Rationale**:
- **TypeScript**: 型安全性により、Firestoreのデータモデルとの整合性を保証
- **React 18**: 
  - Concurrent Renderingでリアルタイム更新のパフォーマンス向上
  - Suspenseでローディング状態の管理が簡潔
  - 豊富なエコシステム（React Testing Library、多数のUIライブラリ）
- **Firebase SDK v9+との親和性**: React Hooksパターンで自然にFirestoreリスナーを統合可能

**Alternatives Considered**:
- **Vue.js 3**: Composition APIとの親和性も高いが、Reactの方がFirebaseとの統合例が豊富
- **Svelte**: バンドルサイズが小さいが、エコシステムと学習リソースがReactより限定的

### 2. State Management

**Decision**: React Context + Custom Hooks (no Redux)

**Rationale**:
- **シンプルさ**: Todo管理のような中規模アプリケーションではReduxは過剰
- **Firestore連携**: `useTodos()`, `useTags()` hooksでFirestoreリアルタイムリスナーを直接ラップ
- **パフォーマンス**: React 18のuseSyncExternalStoreで最適化可能
- **テスタビリティ**: Custom HooksはMockが容易

**Alternatives Considered**:
- **Redux Toolkit**: 大規模アプリには有効だが、初期設定が複雑で本プロジェクトには過剰
- **Zustand**: 軽量だが、Firestoreリアルタイムリスナーとの統合にカスタムコードが必要

### 3. UI Component Library

**Decision**: TailwindCSS + Headless UI

**Rationale**:
- **TailwindCSS**: ユーティリティファーストで開発速度向上、カスタマイズ性が高い
- **Headless UI**: アクセシビリティ対応済みのコンポーネント（Dialog、Menu等）
- **軽量**: 使用しないスタイルはビルド時に削除（PurgeCSS）
- **プリセットカラーパレット実装が容易**: Tailwindのcolor paletteを活用

**Alternatives Considered**:
- **Material-UI (MUI)**: 重厚でカスタマイズが難しい
- **Chakra UI**: 良い選択肢だが、TailwindCSSの方がConstitutionで推奨

### 4. Build Tool

**Decision**: Vite

**Rationale**:
- **高速な開発サーバー**: ESM nativeで即座のHMR
- **最適化されたビルド**: Rollupベースで小さなバンドルサイズ
- **TypeScript対応**: 追加設定不要
- **Firebase Hostingとの互換性**: 静的ファイル出力が簡単

**Alternatives Considered**:
- **Create React App (CRA)**: 遅いビルド、Webpack設定のカスタマイズが困難
- **Next.js**: SSRが不要なのでオーバースペック

### 5. Testing Strategy

**Decision**: Vitest + React Testing Library + Firebase Emulator Suite

**Rationale**:
- **Vitest**: Viteとシームレス統合、Jest互換API、高速
- **React Testing Library**: ユーザー視点のテスト、アクセシビリティ重視
- **Firebase Emulator Suite**: 
  - Firestoreのローカルエミュレーション
  - セキュリティルールのテスト
  - 実際のFirebase環境に近い統合テスト

**Test Coverage Goals**:
- ユニットテスト: services, hooks, utils（80%以上）
- 統合テスト: Firestore操作、リアルタイム同期（主要フロー100%）
- E2Eテスト: Playwrightで重要なユーザージャーニー

**Alternatives Considered**:
- **Jest**: VitestよりビルドとHMRが遅い

### 6. Firestore Data Modeling Best Practices

**Decision**: ドキュメント指向設計 + サブコレクション

**Rationale**:
- **Users Collection**: `/users/{userId}` - ユーザー基本情報
- **Todos Subcollection**: `/users/{userId}/todos/{todoId}` - ユーザーごとのTodo分離
- **Tags Subcollection**: `/users/{userId}/tags/{tagId}` - ユーザーごとのタグ分離
- **Security Rules簡潔化**: サブコレクション構造でルールが自然に記述可能

**Query Optimization**:
- **Composite Index**: `createdAt DESC` でTodoの降順ソート
- **Array Contains Query**: Todoの `tagIds` 配列でタグフィルタリング

**Alternatives Considered**:
- **Flat Collection Structure**: `/todos/{todoId}` - Security Rulesが複雑化し、クエリが非効率

### 7. Authentication Flow

**Decision**: Firebase Authentication with Email/Password + Google OAuth

**Rationale**:
- **Email/Password**: 基本的な認証方法、テストが容易
- **Google OAuth**: ユーザーの利便性向上、Firebase SDKで簡単に統合
- **セッション管理**: Firebase SDKが自動処理（トークンリフレッシュ等）

**Implementation Pattern**:
```typescript
// useAuth() hookでAuthStateを管理
const { user, loading, signIn, signUp, signOut } = useAuth();
```

### 8. Error Handling & Retry Strategy

**Decision**: Exponential Backoff + Toast Notifications

**Rationale**:
- **Firestore自動リトライ**: デフォルトで一時的なエラーはリトライ
- **カスタムリトライロジック**: 
  - 最大3回リトライ
  - Exponential backoff (1秒、2秒、4秒)
  - ユーザーへのトースト通知
- **エラーログ**: Firebase Analyticsで追跡

**Error Categories**:
- **Network Errors**: 自動リトライ + トースト
- **Permission Denied**: トースト + ログイン画面へリダイレクト
- **Validation Errors**: インラインエラーメッセージ

### 9. Performance Optimization

**Decision**: 
- **Firestore Real-time Listeners**: `onSnapshot()` で100ms以内の更新
- **Lazy Loading**: React.lazy() でコンポーネント分割
- **Memoization**: React.memo, useMemo, useCallback で不要な再レンダリング防止
- **Pagination**: 初期は50件、スクロールで追加読み込み（将来対応）

**Monitoring**:
- **Firebase Performance Monitoring**: ページロード時間、ネットワークレイテンシ
- **Custom Metrics**: 同期レスポンス時間、エラー率

### 10. Development & Deployment Workflow

**Decision**: 
- **Firebase Emulator Suite**: ローカル開発
- **GitHub Actions**: CI/CD パイプライン
- **Firebase Hosting**: 本番デプロイ

**CI/CD Pipeline**:
1. PR作成時: Lint + テスト実行
2. mainブランチマージ時: ビルド + Firebase Hosting Previewチャンネルへデプロイ
3. タグプッシュ時: 本番環境へデプロイ

## Open Questions & Future Considerations

### Resolved in Clarification Phase:
- ✅ Todo完了機能: 将来バージョンで実装
- ✅ 同期エラー通知: トースト + 3回リトライ
- ✅ タグ色選択: プリセットカラーパレット（8-12色）
- ✅ Todo並び替え: 不可（作成日時降順固定）
- ✅ 空状態表示: 説明メッセージ + 作成ボタン

### Future Enhancements:
- **オフライン対応**: Firestore offline persistence
- **完了機能**: Todo完了状態とフィルタリング
- **並び替え**: ユーザーカスタム順序、ドラッグ&ドロップ
- **ゲーミフィケーション**: ポイント、バッジ、レベルシステム
- **共有機能**: Todoの共有とコラボレーション
- **通知**: ブラウザプッシュ通知

## Security Considerations

### Firebase Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Todos subcollection
      match /todos/{todoId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Tags subcollection
      match /tags/{tagId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### Validation Rules:
- タイトル: 1-100文字
- 説明: 0-1000文字
- タグ名: 1-30文字
- タグ数: 最大20個/Todo

## Conclusion

Firebase（Firestore + Authentication）を中心としたアーキテクチャで、React 18 + TypeScript + TailwindCSSを使用する技術スタックが最適と判断。Constitution要件（リアルタイム同期、テストファースト、パフォーマンス）をすべて満たし、シンプルで保守性の高い実装が可能。
