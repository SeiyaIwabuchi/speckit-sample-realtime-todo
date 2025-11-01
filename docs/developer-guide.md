# Todo管理アプリケーション 開発者ガイド

## 概要

このプロジェクトは、リアルタイムTodo管理アプリケーションの完全な実装例です。React 18、TypeScript 5.x、Firebase、TailwindCSSを使用したモダンなWebアプリケーションです。

### アーキテクチャ

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Firestore, Authentication, Hosting)
- **Styling**: TailwindCSS + Headless UI
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

### 主要な特徴

- **リアルタイム同期**: Firestoreのリアルタイムリスナーを使用
- **型安全**: TypeScriptによる完全な型付け
- **コンポーネント指向**: 再利用可能なUIコンポーネント
- **テスト駆動開発**: 包括的なテストスイート
- **コード分割**: React.lazyによる動的インポート

## 技術スタック

### Core Technologies
- **React 18**: UIライブラリ
- **TypeScript 5.x**: 型安全なJavaScript
- **Vite**: 高速なビルドツールと開発サーバー
- **Firebase**: Backend as a Service
  - Firestore: NoSQLデータベース
  - Authentication: ユーザー認証
  - Hosting: 静的ファイルホスティング

### UI/UX
- **TailwindCSS**: ユーティリティファーストCSSフレームワーク
- **Headless UI**: アクセシブルなUIコンポーネント
- **Heroicons**: SVGアイコンライブラリ

### Development Tools
- **Vitest**: 高速なテストランナー
- **React Testing Library**: Reactコンポーネントテスト
- **ESLint**: JavaScript/TypeScriptリンター
- **Prettier**: コードフォーマッター
- **Playwright**: E2Eテスト（将来拡張用）

## 開発環境のセットアップ

### 前提条件

- Node.js 18+
- npm または yarn
- Firebase CLI（デプロイ時）

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd speckit-sample-realtime-todo

# 依存関係のインストール
cd frontend
npm install

# 環境変数の設定
cp .env.local.example .env.local
# .env.localを編集してFirebase設定を入力
```

### Firebase設定

1. [Firebase Console](https://console.firebase.google.com/) で新規プロジェクトを作成
2. Authenticationを有効化（Email/Password, Google）
3. Firestore Databaseを作成
4. プロジェクト設定からAPIキーを取得
5. `.env.local`に以下の環境変数を設定：

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
# オプション: Google Analyticsを使用する場合
# VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして開発を開始します。

### ビルド

```bash
npm run build
```

### テスト実行

```bash
# ユニットテスト
npm test

# テストをUIモードで実行
npm run test:ui

# カバレッジレポート付きテスト
npm run test:coverage
```

## プロジェクト構造

```
frontend/
├── src/
│   ├── components/          # UIコンポーネント
│   │   ├── layout/         # レイアウトコンポーネント
│   │   ├── todos/          # Todo関連コンポーネント
│   │   ├── tags/           # タグ関連コンポーネント
│   │   └── ui/             # 汎用UIコンポーネント
│   ├── contexts/           # React Context
│   ├── hooks/              # カスタムフック
│   ├── pages/              # ページコンポーネント
│   ├── services/           # 外部サービス/API
│   ├── types/              # TypeScript型定義
│   ├── utils/              # ユーティリティ関数
│   └── styles/             # グローバルスタイル
├── tests/                  # テストファイル
├── public/                 # 静的ファイル
└── docs/                   # ドキュメント
```

### 主要ディレクトリの説明

- **components/**: 再利用可能なUIコンポーネント
- **contexts/**: グローバル状態管理（認証など）
- **hooks/**: ビジネスロジックをカプセル化したカスタムフック
- **pages/**: ルートレベルページコンポーネント
- **services/**: Firebaseなどの外部サービスとの通信
- **types/**: アプリケーション全体の型定義
- **utils/**: ヘルパー関数と共通処理

## アーキテクチャの詳細

### データフロー

```
User Action → Component → Hook → Service → Firebase
                                      ↓
                                 Real-time Updates
                                      ↓
                               UI Re-render
```

### 状態管理

- **Local State**: React useState/useReducer
- **Server State**: Firebase Firestore (リアルタイム)
- **Global State**: React Context (認証状態)

### サービス層

#### AuthService
- Firebase Authenticationとの連携
- ログイン/ログアウト/サインアップ処理
- 認証状態の監視

#### TodoService
- Firestore CRUD操作
- リアルタイムリスナー管理
- エラーハンドリングとリトライロジック

#### TagService
- タグのCRUD操作
- カスケード削除（Todoからのタグ削除）

#### AnalyticsService
- Firebase Analyticsとの連携
- ユーザー行動のトラッキング

### フック層

#### useAuth
- 認証状態管理
- ログイン/ログアウト処理

#### useTodos
- Todo一覧の取得と管理
- CRUD操作の提供

#### useTags
- タグ一覧の取得と管理
- タグ操作の提供

## コンポーネント設計

### コンポーネントの分類

1. **Page Components**: ルートレベルのページ（`pages/`）
2. **Layout Components**: 共通レイアウト（`components/layout/`）
3. **Feature Components**: 機能固有コンポーネント（`components/todos/`など）
4. **UI Components**: 汎用UIコンポーネント（`components/ui/`）

### コンポーネントの原則

- **単一責任**: 各コンポーネントは一つの責任のみ
- **再利用性**: 可能な限り再利用可能な設計
- **Propsインターフェース**: 明確な型定義
- **テスト容易性**: テストしやすい構造

## テスト戦略

### テストの種類

1. **Unit Tests**: 個別関数/コンポーネントのテスト
2. **Integration Tests**: 複数コンポーネントの連携テスト
3. **E2E Tests**: ユーザー操作の完全シナリオテスト

### テストファイルの配置

```
tests/
├── unit/                    # ユニットテスト
│   ├── services/           # サービス層テスト
│   ├── hooks/              # フックテスト
│   └── components/         # コンポーネントテスト
├── integration/            # 統合テスト
└── e2e/                    # E2Eテスト
```

### テスト実行例

```bash
# 特定のテストファイルを実行
npm test TodoService.test.ts

# 特定のテストスイートを実行
npm test -- --grep "authentication"

# カバレッジレポート生成
npm run test:coverage
```

## コーディング規約

### TypeScript

- **strictモード**: すべての型チェックを有効化
- **インターフェース優先**: オブジェクト型にはinterfaceを使用
- **型エイリアス**: プリミティブ型にはtypeを使用

### React

- **Functional Components**: クラスコンポーネントは使用しない
- **Hooks**: 状態管理にカスタムフックを使用
- **Props**: 明確な型定義とデフォルト値

### 命名規則

- **Components**: PascalCase (例: `TodoList`)
- **Functions**: camelCase (例: `createTodo`)
- **Constants**: UPPER_SNAKE_CASE (例: `API_BASE_URL`)
- **Files**: kebab-case (例: `todo-service.ts`)

### コミットメッセージ

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加/修正
chore: その他の変更
```

## Firebase設定

### Firestoreセキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /todos/{todoId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /tags/{tagId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Firestoreインデックス

複合クエリ用のインデックスが `firestore.indexes.json` で定義されています。

## デプロイ

### Firebase Hostingへのデプロイ

```bash
# Firebase CLIのインストール
npm install -g firebase-tools

# ログイン
firebase login

# プロジェクトの選択
firebase use your-project-id

# デプロイ
firebase deploy
```

### 環境別のデプロイ

```bash
# ステージング環境
firebase deploy --only hosting:staging

# 本番環境
firebase deploy --only hosting:production
```

## パフォーマンス最適化

### コード分割
- React.lazyを使用した動的インポート
- ページ単位でのチャンク分割

### バンドル最適化
- Viteのツリーシェイキング
- 未使用コードの除去

### Firebase最適化
- Firestoreクエリの最適化
- リアルタイムリスナーの適切な管理

## トラブルシューティング

### よくある問題

#### Firebase接続エラー
- 環境変数が正しく設定されているか確認
- Firebaseプロジェクトが正しく設定されているか確認

#### ビルドエラー
- Node.jsのバージョンが18以上か確認
- 依存関係が正しくインストールされているか確認

#### テスト失敗
- Firebaseエミュレーターが起動しているか確認
- テスト環境の設定を確認

### デバッグ

```bash
# 開発サーバーの起動（詳細ログ）
npm run dev -- --debug

# Firebaseエミュレーターの起動
firebase emulators:start
```

## 貢献ガイドライン

### 開発フロー

1. Issueを作成または既存のIssueを確認
2. ブランチを作成: `git checkout -b feature/your-feature-name`
3. テスト駆動開発で実装
4. コミット: `git commit -m "feat: add new feature"`
5. プルリクエストを作成

### コードレビューの基準

- **機能性**: 要求された機能が正しく実装されている
- **テスト**: 適切なテストが追加されている
- **コード品質**: コーディング規約に従っている
- **パフォーマンス**: パフォーマンスに悪影響がない
- **セキュリティ**: セキュリティ上の問題がない

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## サポート

技術的な質問や問題については、以下の方法で連絡してください：

- GitHub Issues: バグ報告や機能リクエスト
- Pull Requests: コード貢献
- ドキュメント: この開発者ガイドの更新

---

## 更新履歴

### v1.0.0
- 初回リリース
- 完全なTodo管理機能の実装
- Firebase統合
- TypeScript + React 18
- 包括的なテストスイート
- 開発者ドキュメント