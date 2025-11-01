# Speckit Sample: リアルタイムTodo管理アプリケーション

[![CI](https://github.com/SeiyaIwabuchi/speckit-sample-realtime-todo/actions/workflows/ci.yml/badge.svg)](https://github.com/SeiyaIwabuchi/speckit-sample-realtime-todo/actions/workflows/ci.yml)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

リアルタイム同期機能を備えたモダンなTodo管理アプリケーションです。複数のデバイス間でTodoの変更が即座に同期され、タグによる分類機能で効率的なタスク管理を実現します。

## ✨ 特徴

- **リアルタイム同期**: 複数のクライアント間でTodoの変更が100ms以内に同期
- **タグ管理**: カラフルなタグでTodoを分類・整理
- **レスポンシブデザイン**: デスクトップ・モバイル両対応
- **アクセシビリティ**: WCAG 2.1 AA準拠の高いアクセシビリティ
- **TypeScript**: 型安全な開発環境
- **テスト駆動開発**: 包括的なテストカバレッジ

## 🚀 主な機能

### Todo管理
- ✅ Todoの作成・編集・削除
- ✅ タイトルと詳細な説明の入力
- ✅ 作成日時による自動ソート（降順）
- ✅ 削除時の確認ダイアログ

### タグ機能
- 🏷️ タグの作成・編集・削除
- 🎨 8色のプリセットカラーパレット
- 🔗 Todoへの複数タグ付け
- 🏷️ タグによる絞り込み検索

### リアルタイム同期
- 🔄 複数デバイス間での即時同期
- 📱 異なるブラウザタブ間での同期
- ⚡ 100ms以内の高速同期

### ユーザー体験
- 🎯 直感的なUI/UX
- ⌨️ キーボード操作対応
- 📱 モバイルフレンドリー
- 🔍 スクリーンリーダー対応

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript 5** - 型安全なJavaScript
- **Vite** - 高速なビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **React Router** - クライアントサイドルーティング
- **Headless UI** - アクセシブルなUIコンポーネント

### バックエンド & インフラ
- **Firebase** - 認証・データベース・ホスティング
- **Firestore** - リアルタイムデータベース
- **Firebase Auth** - ユーザー認証

### 開発ツール
- **Vitest** - 高速なテストフレームワーク
- **Testing Library** - アクセシビリティ重視のテスト
- **ESLint** - コード品質チェック
- **TypeScript ESLint** - TypeScript特化のLinting

## 📋 前提条件

- Node.js 18+
- npm または yarn
- Firebaseプロジェクト

## 🚀 インストール & セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/SeiyaIwabuchi/speckit-sample-realtime-todo.git
cd speckit-sample-realtime-todo
```

### 2. Firebase設定

1. [Firebase Console](https://console.firebase.google.com/) で新規プロジェクトを作成
2. Firestore Databaseを有効化
3. Authenticationでメールアドレス/パスワード認証を有効化
4. プロジェクト設定から `firebaseConfig` を取得

### 3. 環境変数の設定

`frontend/.env.local` ファイルを作成し、Firebase設定を追加：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. 依存関係のインストール

```bash
# ルートディレクトリで
npm install

# またはyarnを使用する場合
yarn install
```

### 5. Firebase設定のデプロイ

```bash
# Firebase CLIがインストールされている場合
firebase deploy --only firestore:rules,firestore:indexes
```

## 🏃‍♂️ 開発

### 開発サーバーの起動

```bash
cd frontend
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリケーションにアクセスできます。

### ビルド

```bash
cd frontend
npm run build
```

### プレビュー

```bash
cd frontend
npm run preview
```

## 🧪 テスト

### ユニットテスト実行

```bash
cd frontend
npm test
```

### テストカバレッジ

```bash
cd frontend
npm run test:coverage
```

### UIテスト

```bash
cd frontend
npm run test:ui
```

## 📝 使用方法

### アプリケーションの起動

1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `http://localhost:5173` を開く
3. アカウント作成またはログイン

### Todoの作成

1. トップページの「Todoを追加」ボタンをクリック
2. タイトルと説明を入力
3. 必要に応じてタグを選択
4. 「作成」ボタンをクリック

### タグの管理

1. サイドバーまたはヘッダーの「タグ管理」をクリック
2. 新しいタグを作成するには「タグを追加」ボタンをクリック
3. タグ名を入力し、色を選択
4. 既存のタグを編集・削除するには該当のタグをクリック

### Todoの絞り込み

1. Todo一覧ページでフィルターバーを使用
2. タグを選択して絞り込み
3. 複数のタグを選択可能（OR条件）

## 🔧 開発ガイドライン

### コード品質

- **ESLint**: コミット前に必ずlintを実行
- **TypeScript**: 厳格な型チェックを有効化
- **テスト**: 新機能は必ずテストを追加

### コミットメッセージ

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更
```

### ブランチ戦略

- `main`: プロダクションブランチ
- `develop`: 開発ブランチ
- `feature/*`: 機能開発ブランチ
- `fix/*`: バグ修正ブランチ

## 🚀 デプロイ

### Firebase Hostingへのデプロイ

```bash
# Firebase CLIがインストールされている場合
firebase deploy --only hosting
```

### 自動デプロイ

GitHub Actionsでmainブランチへのプッシュ時に自動デプロイされます。

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'feat: Add amazing feature'`
4. ブランチをプッシュ: `git push origin feature/amazing-feature`
5. Pull Requestを作成

### 貢献ガイドライン

- テストカバレッジを維持（最低80%）
- 新機能には適切なテストを追加
- ESLintエラーを解消してからコミット
- コミットメッセージは明確に記述

## 📊 プロジェクト構造

```
speckit-sample-realtime-todo/
├── frontend/                 # Reactアプリケーション
│   ├── src/
│   │   ├── components/       # Reactコンポーネント
│   │   │   ├── tags/        # タグ関連コンポーネント
│   │   │   ├── todo/        # Todo関連コンポーネント
│   │   │   └── ui/          # 共通UIコンポーネント
│   │   ├── hooks/           # カスタムReactフック
│   │   ├── services/        # Firebaseサービス
│   │   ├── types/           # TypeScript型定義
│   │   ├── utils/           # ユーティリティ関数
│   │   └── pages/           # ページコンポーネント
│   ├── tests/               # テストファイル
│   └── public/              # 静的ファイル
├── .firebase/               # Firebase設定
├── specs/                   # 仕様書
└── docs/                    # ドキュメント
```

## 📈 パフォーマンス指標

- **初期ロード**: 3秒以内
- **リアルタイム同期**: 100ms以内
- **同時接続**: 最低10ユーザー対応
- **Todo管理**: 1ユーザーあたり500件まで

## 🔒 セキュリティ

- Firebase Authenticationによるユーザー認証
- ユーザーごとのデータ分離
- XSS対策済み
- セッションタイムアウト実装

## 📄 ライセンス

このプロジェクトは [ISC License](LICENSE) の下で公開されています。

## 🙋‍♂️ サポート

バグ報告や機能リクエストは [GitHub Issues](https://github.com/SeiyaIwabuchi/speckit-sample-realtime-todo/issues) までお願いします。

## 📚 関連ドキュメント

- [仕様書](./specs/001-realtime-todo-crud/spec.md)
- [APIドキュメント](./docs/api.md)
- [開発ガイド](./docs/development.md)

---

**Made with ❤️ using React, TypeScript, and Firebase**</content>
<parameter name="filePath">/Users/seiya_iwabuchi/dev-local/speckit-sample-realtime-todo/README.md