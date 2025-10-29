<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.1
- Modified: Technology Stack section (specified Firebase as primary backend)
- Added: Firebase services (Firestore, Authentication, Hosting, Functions)
- Clarified: Real-time synchronization using Firestore
- Templates requiring updates: 
  ✅ constitution.md - updated
  ⚠ plan-template.md - needs validation for Firebase-specific technical context
  ⚠ spec-template.md - aligned with current stack
  ⚠ tasks-template.md - aligned with current stack
- Follow-up TODOs: None
-->

# リアルタイム動機型メモ帳 Constitution

## Core Principles

### I. リアルタイム同期
すべてのメモ操作はリアルタイムで同期される。複数のクライアント間での即座のデータ共有が必須。
Firestoreのリアルタイムリスナー機能を活用し、100ms以下のレスポンス時間を維持する。
Firestoreの組み込みトランザクションと楽観的ロックを使用し、競合解決とデータ整合性を保証する。

### II. 動機駆動型UI
ユーザーの動機を高める要素を継続的に提供する。進捗可視化、達成感の演出、継続性の促進機能を含む。
ゲーミフィケーション要素（ポイント、レベル、バッジ）を適切に実装し、過度にならないよう配慮する。
ユーザーエンゲージメント指標を追跡し、継続的に改善を行う。

### III. テストファースト開発 (NON-NEGOTIABLE)
TDD必須：テスト作成→ユーザー承認→テスト失敗→実装の順序を厳守する。
Red-Green-Refactorサイクルを厳格に実行し、全機能についてユニット・統合テストを作成する。
リアルタイム機能については特に、同時接続テストとパフォーマンステストを重視する。

### IV. データ永続化とプライバシー
ユーザーデータの安全な永続化と適切なプライバシー保護を実装する。
Firebase Security Rulesを活用した堅牢なアクセス制御、Firebase Authenticationによる認証を実装する。
GDPR等のプライバシー規制に準拠し、ユーザーが自身のデータを完全に制御できる機能を提供する。
Firestoreの自動バックアップ機能とデータエクスポート機能を活用してデータ復旧戦略を確立する。

### V. パフォーマンスとスケーラビリティ
高いパフォーマンスと将来のスケーラビリティを考慮した設計を採用する。
メモリ効率、レスポンシブ設計、段階的機能読み込みを実装する。
同時接続数とデータ量の増加に対応できるアーキテクチャを構築する。

## Technology Stack

最新のWeb技術スタックを採用し、メンテナンス性と開発効率を重視する。

**フロントエンド**：
- TypeScript、React/Vue.js、TailwindCSS等のモダンフレームワーク
- Firebase SDK (v9以降のモジュラー版を使用)

**バックエンド（Firebase）**：
- **Firestore**: リアルタイムデータベース。ドキュメント指向、自動同期機能を活用
- **Firebase Authentication**: ユーザー認証（Email/Password、Google、GitHub等）
- **Cloud Functions for Firebase**: サーバーサイドロジック、バックグラウンド処理
- **Firebase Hosting**: 静的コンテンツのホスティング
- **Firebase Storage**: ファイルストレージ（将来的にメモへの添付ファイル対応時）

**開発・デプロイ**：
- Firebase CLI、Firebase Emulator Suite（ローカル開発）
- GitHub Actions（CI/CDパイプライン）
- Firebase Security Rules（アクセス制御）

**理念**: Firebaseのマネージドサービスを活用することで、インフラ管理のオーバーヘッドを最小化し、
リアルタイム同期機能の実装に集中できる。初期段階では特にFirestoreの組み込みリアルタイム機能と
Firebase Authenticationを最大限活用し、開発速度を重視する。

## Development Process

アジャイル開発手法を採用し、継続的なフィードバックループを確立する。
2週間スプリント、毎日のスタンドアップ、スプリントレビューを実施する。
コードレビューは必須で、最低2名の承認が必要。セキュリティとパフォーマンスの観点を重視する。
ユーザビリティテストを定期的に実施し、UX改善を継続的に行う。

## Governance

この構成文書はすべての開発実践に優先する。
修正には文書化、承認、移行計画が必要。
すべてのPR/レビューでコンプライアンス検証を実施する。
複雑性は十分に正当化される必要がある。

**Version**: 1.0.1 | **Ratified**: 2025-10-29 | **Last Amended**: 2025-10-29
