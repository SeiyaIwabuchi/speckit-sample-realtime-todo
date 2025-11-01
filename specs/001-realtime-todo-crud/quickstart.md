# Quickstart: リアルタイムTodo管理

**Feature**: 001-realtime-todo-crud  
**Date**: 2025-10-29  
**Purpose**: 開発者向けセットアップとクイックスタートガイド

## Prerequisites

- **Node.js**: 18.x以上
- **npm**: 9.x以上 または **yarn**: 1.22.x以上
- **Firebaseプロジェクト**: [Firebase Console](https://console.firebase.google.com/)で作成済み
- **Git**: バージョン管理用

## 1. リポジトリのクローンとブランチ切り替え

```bash
cd /Users/seiya_iwabuchi/dev-local/speckit-sample-realtime-todo
git checkout 001-realtime-todo-crud
```

## 2. Firebase Project Setup

### 2.1 Firebase Consoleでプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `realtime-todo-app`（任意）
4. Google Analytics: 有効化（推奨）

### 2.2 Firebaseアプリ登録

1. Firebase Consoleでプロジェクトを開く
2. 「ウェブアプリを追加」を選択
3. アプリのニックネーム: `Todo Frontend`
4. Firebase Hostingのセットアップ: チェック
5. 設定情報（API Key等）をコピーして保存

### 2.3 Authentication有効化

1. Firebase Console → Authentication → Sign-in method
2. 「メール/パスワード」を有効化
3. 「Google」を有効化

### 2.4 Firestore Database作成

1. Firebase Console → Firestore Database
2. 「データベースを作成」
3. モード: **本番環境モード**を選択（Security Rulesを後で設定）
4. ロケーション: `asia-northeast1`（東京）推奨

## 3. Frontend Setup

### 3.1 プロジェクト構造作成

```bash
mkdir -p frontend/src/{components/{todos,tags,ui,layout},pages,services,hooks,types,utils}
mkdir -p frontend/tests/{unit,integration,e2e}
cd frontend
```

### 3.2 依存関係のインストール

```bash
# プロジェクト初期化
npm init -y

# Core dependencies
npm install react@18 react-dom@18 typescript@5
npm install firebase@10
npm install react-router-dom@6

# UI & Styling
npm install tailwindcss@3 postcss autoprefixer
npm install @headlessui/react @heroicons/react

# Build tool
npm install vite@5 @vitejs/plugin-react

# Development dependencies
npm install -D @types/react @types/react-dom
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

### 3.3 設定ファイル作成

#### `frontend/package.json`

```json
{
  "name": "realtime-todo-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

#### `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts'
  }
});
```

#### `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tag-red': '#EF4444',
        'tag-orange': '#F97316',
        'tag-yellow': '#EAB308',
        'tag-green': '#22C55E',
        'tag-teal': '#14B8A6',
        'tag-blue': '#3B82F6',
        'tag-indigo': '#6366F1',
        'tag-purple': '#A855F7',
        'tag-pink': '#EC4899',
        'tag-gray': '#6B7280'
      }
    },
  },
  plugins: [],
}
```

### 3.4 Firebase設定ファイル

#### `frontend/src/services/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### `frontend/.env.local`（Gitignoreに追加）

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 4. Firebase CLI Setup

### 4.1 Firebase CLIインストール

```bash
npm install -g firebase-tools
```

### 4.2 Firebase Login

```bash
firebase login
```

### 4.3 Firebase初期化

```bash
cd /Users/seiya_iwabuchi/dev-local/speckit-sample-realtime-todo
firebase init

# 選択項目:
# - Firestore: Configure security rules and indexes files
# - Hosting: Configure files for Firebase Hosting
# - Emulators: Set up local emulators
```

設定内容:
- Firestoreルールファイル: `firestore.rules`
- Firestoreインデックスファイル: `firestore.indexes.json`
- Hostingパブリックディレクトリ: `frontend/dist`
- シングルページアプリ: Yes
- Emulators: Firestore, Authentication

### 4.4 Firestore Security Rules

#### `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function validateTodo() {
      let data = request.resource.data;
      return data.title is string
        && data.title.size() >= 1
        && data.title.size() <= 100
        && (!('description' in data) || (data.description is string && data.description.size() <= 1000))
        && (!('tagIds' in data) || (data.tagIds is list && data.tagIds.size() <= 20))
        && data.userId == request.auth.uid;
    }
    
    function validateTag() {
      let data = request.resource.data;
      return data.name is string
        && data.name.size() >= 1
        && data.name.size() <= 30
        && data.color is string
        && data.userId == request.auth.uid;
    }
    
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create, update: if isOwner(userId);
      
      match /todos/{todoId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && validateTodo();
        allow update: if isOwner(userId) && validateTodo();
        allow delete: if isOwner(userId);
      }
      
      match /tags/{tagId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && validateTag();
        allow update: if isOwner(userId) && validateTag();
        allow delete: if isOwner(userId);
      }
    }
  }
}
```

#### `firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "todos",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "todos",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "tagIds", "arrayConfig": "CONTAINS" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "tags",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "name", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 4.5 Security Rulesデプロイ

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 5. Local Development with Emulators

### 5.1 Emulator起動

```bash
firebase emulators:start
```

Emulator Suite UI: http://localhost:4000

### 5.2 フロントエンド開発サーバー起動

```bash
cd frontend
npm run dev
```

アプリケーション: http://localhost:3000

### 5.3 Emulator接続設定（開発環境のみ）

`frontend/src/services/firebase.ts`に追加:

```typescript
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 6. Testing

### 6.1 ユニットテスト実行

```bash
cd frontend
npm test
```

### 6.2 UIテスト（Vitest UI）

```bash
npm run test:ui
```

ブラウザでhttp://localhost:51204にアクセス

### 6.3 E2Eテスト（今後追加）

Playwrightセットアップ:

```bash
npm install -D @playwright/test
npx playwright install
```

## 7. Deployment

### 7.1 本番ビルド

```bash
cd frontend
npm run build
```

### 7.2 Firebase Hostingへデプロイ

```bash
cd ..
firebase deploy --only hosting
```

デプロイURL: https://your-project-id.web.app

## 8. Verification Steps

### 8.1 認証テスト

1. アプリケーションを開く
2. 「サインアップ」でメール/パスワード登録
3. ログイン成功を確認

### 8.2 Todo CRUD テスト

1. 「Todoを作成」ボタンをクリック
2. タイトルと説明を入力して保存
3. 一覧にTodoが表示されることを確認
4. Todoを編集して変更が反映されることを確認
5. Todoを削除して一覧から消えることを確認

### 8.3 リアルタイム同期テスト

1. 2つのブラウザウィンドウで同じアカウントにログイン
2. 一方のウィンドウでTodoを作成
3. もう一方のウィンドウに即座に表示されることを確認（100ms以内）

### 8.4 タグ機能テスト

1. 「タグを作成」でタグを追加（色を選択）
2. Todoにタグを付ける
3. タグで絞り込みフィルタリングが動作することを確認

## 9. Troubleshooting

### 問題: Firebase接続エラー

**解決策**:
- `.env.local`のFirebase設定を確認
- Firebase Consoleでアプリが正しく登録されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### 問題: Permission denied (Firestore)

**解決策**:
- Security Rulesがデプロイされているか確認: `firebase deploy --only firestore:rules`
- ユーザーが正しく認証されているか確認
- Firebase ConsoleのFirestoreルールシミュレーターでテスト

### 問題: リアルタイム同期が遅い

**解決策**:
- ネットワーク接続を確認
- Firestoreインデックスが作成されているか確認: `firebase deploy --only firestore:indexes`
- ブラウザの開発者ツールでネットワークレイテンシを確認

## 10. Next Steps

実装計画に従ってタスクを実行:

1. **Phase 2**: `/speckit.tasks`コマンドでタスクリストを生成
2. **Test-First**: 各機能のテストを先に作成
3. **Implementation**: TDDサイクル（Red-Green-Refactor）で実装
4. **Review**: Constitution Checkで原則準拠を確認

## Reference Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev)
