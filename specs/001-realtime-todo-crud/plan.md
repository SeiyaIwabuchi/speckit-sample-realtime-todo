# Implementation Plan: リアルタイムTodo管理

**Branch**: `001-realtime-todo-crud` | **Date**: 2025-10-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-realtime-todo-crud/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

ユーザーがTodoをCRUD操作でき、複数のクライアント間でリアルタイムに同期されるWebアプリケーション。Todoには複数のタグを付けて分類・絞り込みが可能。Firebase（Firestore、Authentication）を活用してリアルタイム同期とユーザー認証を実装し、TypeScript + React/Vue.jsでモダンなUIを構築する。100ms以内の同期レスポンス、エラー処理、空状態の適切な表示を含む。

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 18+  
**Primary Dependencies**: Firebase SDK v9+, React 18 or Vue.js 3, TailwindCSS, Vite  
**Storage**: Firestore (NoSQL document database with real-time sync)  
**Testing**: Vitest/Jest, React Testing Library or Vue Test Utils, Firebase Emulator Suite  
**Target Platform**: Web browsers (Chrome, Safari, Firefox, Edge), PWA-ready  
**Project Type**: web  
**Performance Goals**: <100ms Firestore sync latency, <3s initial page load, <1s tag filtering  
**Constraints**: Firebase free tier limits (50k reads/day, 20k writes/day), online-only operation (no offline mode in v1)  
**Scale/Scope**: 10 concurrent users initially, 100 todos per user, 500 todos max per user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. リアルタイム同期
- ✅ **PASS**: Firestoreリアルタイムリスナーを使用して100ms以内の同期を実現
- ✅ **PASS**: Firestoreの組み込みトランザクションで競合解決（Last Write Wins）

### II. 動機駆動型UI
- ⚠️ **DEFERRED**: ゲーミフィケーション要素は将来バージョンで実装（初期バージョンはCRUD機能に集中）
- ✅ **PASS**: 空状態表示、エラートースト通知で基本的なユーザーエンゲージメント確保

### III. テストファースト開発 (NON-NEGOTIABLE)
- ✅ **PASS**: Vitest/Jest + Testing Library でユニット・統合テストを実装
- ✅ **PASS**: Firebase Emulator Suite でリアルタイム同期とパフォーマンステストを実施
- ✅ **PASS**: TDDサイクル（テスト作成→失敗→実装）を厳守

### IV. データ永続化とプライバシー
- ✅ **PASS**: Firebase Security Rules でアクセス制御
- ✅ **PASS**: Firebase Authentication（Email/Password + Google認証）
- ✅ **PASS**: ユーザーごとのデータ分離、GDPRデータエクスポート対応

### V. パフォーマンスとスケーラビリティ
- ✅ **PASS**: Firestoreクエリ最適化、インデックス設計
- ✅ **PASS**: 段階的機能読み込み（Todo一覧のページネーション検討）
- ✅ **PASS**: 100ms同期、3秒初期ロード目標

**Gate Result**: ✅ PASS（動機駆動型UIは将来対応として許容）

## Project Structure

### Documentation (this feature)

```text
specs/001-realtime-todo-crud/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── components/
│   │   ├── todos/
│   │   ├── tags/
│   │   ├── ui/
│   │   └── layout/
│   ├── pages/
│   │   ├── TodoListPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── todoService.ts
│   │   ├── tagService.ts
│   │   └── authService.ts
│   ├── hooks/
│   │   ├── useTodos.ts
│   │   ├── useTags.ts
│   │   └── useAuth.ts
│   ├── types/
│   │   ├── todo.ts
│   │   ├── tag.ts
│   │   └── user.ts
│   └── utils/
│       ├── validation.ts
│       └── errorHandling.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
└── package.json

.github/
└── workflows/
    └── ci.yml
```

**Structure Decision**: Web application structure with frontend-only implementation. Firebase backend (Firestore, Authentication, Functions if needed) is managed through Firebase Console and configuration files. No separate backend directory needed as Firestore provides the database layer and Firebase Authentication handles user management. Firebase Security Rules (firestore.rules) implement server-side access control.

## Phase 0: Research & Technology Decisions

**Output**: `research.md`

✅ **COMPLETED**: Technology decisions documented with 10 key decisions:
1. React 18 over Vue.js/Svelte - Better ecosystem and team familiarity
2. Context API + Custom Hooks over Redux - Reduced complexity for small state
3. TailwindCSS over Material-UI - Faster customization and smaller bundle
4. Vite over Create React App - 10x faster builds
5. Vitest over Jest - Better Vite integration
6. Firestore subcollection pattern - Simplified Security Rules
7. No offline mode in v1 - Reduced complexity
8. Preset color palette - Better UX consistency
9. Firebase Emulator Suite - Local development without cloud costs
10. GitHub Actions CI/CD - Automated testing and deployment

## Phase 1: Design & Contracts

**Outputs**: `data-model.md`, `contracts/`, `quickstart.md`

✅ **COMPLETED**:
- **data-model.md**: Firestore schema (User/Todo/Tag subcollections), composite indexes, Security Rules with validation functions, cascade delete patterns
- **contracts/service-contracts.md**: TypeScript interfaces for AuthService (6 methods), TodoService (6 methods with real-time subscriptions), TagService (5 methods), retry logic with exponential backoff, error handling, validation classes
- **quickstart.md**: Developer onboarding with 10 sections (Prerequisites, Firebase setup, Frontend setup, Emulator usage, Testing, Deployment, Troubleshooting)

### Constitution Check Re-Evaluation (Post-Design)

#### I. リアルタイム同期
- ✅ **PASS (Verified)**: `subscribeTodos()` and `subscribeFilteredTodos()` in TodoService use Firestore `onSnapshot()` for real-time updates
- ✅ **PASS (Verified)**: Composite indexes defined in `firestore.indexes.json` support efficient real-time queries
- ✅ **PASS (Verified)**: Performance target <100ms sync latency documented in service contracts

#### II. 動機駆動型UI
- ⚠️ **DEFERRED (Confirmed)**: No gamification in Phase 1, deferred to future versions
- ✅ **PASS (Verified)**: Empty state patterns documented in quickstart.md (verification steps)
- ✅ **PASS (Verified)**: Toast notification contracts defined for user feedback

#### III. テストファースト開発 (NON-NEGOTIABLE)
- ✅ **PASS (Verified)**: Testing strategy in research.md with Vitest + React Testing Library
- ✅ **PASS (Verified)**: MockFirestore patterns documented in service-contracts.md
- ✅ **PASS (Verified)**: Firebase Emulator Suite setup in quickstart.md (Section 5)
- ✅ **PASS (Verified)**: Test scripts defined in package.json (`npm test`, `npm run test:ui`)

#### IV. データ永続化とプライバシー
- ✅ **PASS (Verified)**: Security Rules in `firestore.rules` enforce per-user data isolation
- ✅ **PASS (Verified)**: Validation functions (`validateTodo()`, `validateTag()`) prevent malicious data
- ✅ **PASS (Verified)**: Subcollection pattern (`users/{userId}/todos/{todoId}`) ensures data privacy
- ✅ **PASS (Verified)**: Firebase Authentication with Email/Password + Google provider

#### V. パフォーマンスとスケーラビリティ
- ✅ **PASS (Verified)**: Composite indexes for optimized queries on `userId + createdAt` and `userId + tagIds + createdAt`
- ✅ **PASS (Verified)**: Retry logic with exponential backoff (1s→2s→4s) handles network issues
- ✅ **PASS (Verified)**: Performance monitoring contracts (`trackSyncLatency()`, `trackOperationDuration()`)
- ✅ **PASS (Verified)**: Bundle optimization with Vite code splitting and tree shaking

**Re-Evaluation Result**: ✅ ALL PRINCIPLES SATISFIED (except II deferred as planned)

## Phase 2 Report

**Command**: `/speckit.plan`  
**Branch**: `001-realtime-todo-crud`  
**Plan Path**: `/Users/seiya_iwabuchi/dev-local/speckit-sample-realtime-todo/specs/001-realtime-todo-crud/plan.md`

### Generated Artifacts

1. **research.md** (Phase 0)
   - Technology decisions with alternatives and justifications
   - Firebase ecosystem components breakdown
   - Testing strategy with Emulator Suite

2. **data-model.md** (Phase 1)
   - Firestore schema: User → Todos/Tags subcollections
   - Composite indexes for query optimization
   - Security Rules with validation functions
   - CRUD operation patterns with retry logic

3. **contracts/service-contracts.md** (Phase 1)
   - AuthService interface (6 methods)
   - TodoService interface (6 methods, real-time subscriptions)
   - TagService interface (5 methods)
   - Retry logic: exponential backoff (3 attempts)
   - Validation classes and error handling
   - Performance monitoring contracts
   - Testing patterns with MockFirestore

4. **quickstart.md** (Phase 1)
   - Prerequisites and Firebase project setup
   - Frontend setup with npm dependencies
   - Configuration files (vite.config.ts, tsconfig.json, tailwind.config.js)
   - Firestore Security Rules and indexes deployment
   - Firebase Emulator Suite usage
   - Testing commands and verification steps
   - Troubleshooting guide

### AI Agent Context Updated

✅ GitHub Copilot context file updated: `.github/copilot-instructions.md`
- Added language: TypeScript 5.x, Node.js 18+
- Added framework: Firebase SDK v9+, React 18 or Vue.js 3, TailwindCSS, Vite
- Added database: Firestore (NoSQL document database with real-time sync)

### Next Steps

**Manual Task**: Generate implementation tasks with `/speckit.tasks` command
- This will create `tasks.md` with granular, test-first tasks
- Each task includes: description, dependencies, acceptance criteria, test requirements

**Development Workflow**:
1. Review `quickstart.md` and set up local environment
2. Run `/speckit.tasks` to generate task list
3. Follow TDD cycle: Write test → Implement → Refactor
4. Use Firebase Emulator for local testing (no cloud costs)
5. Deploy to Firebase Hosting when ready

**Constitution Compliance**: ✅ All principles satisfied (motivation-driven UI deferred as documented)

---

**Planning Phase Complete** | Generated by `/speckit.plan` on 2025-10-29

````
