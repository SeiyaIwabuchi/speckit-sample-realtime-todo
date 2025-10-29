# Tasks: リアルタイムTodo管理

**Feature Branch**: `001-realtime-todo-crud`  
**Date**: 2025-10-29  
**Input**: Design documents from `/specs/001-realtime-todo-crud/`

**Prerequisites**: 
- ✅ plan.md (tech stack, structure)
- ✅ spec.md (user stories with priorities)
- ✅ data-model.md (Firestore schema)
- ✅ contracts/service-contracts.md (TypeScript interfaces)
- ✅ research.md (technology decisions)
- ✅ quickstart.md (setup guide)

**Tests**: TDD approach is **REQUIRED** (Constitution Principle III - NON-NEGOTIABLE)

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4, US5, US6)
- File paths use `frontend/` prefix per project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Firebase configuration

- [ ] T001 Create project directory structure (frontend/src with subdirectories per plan.md)
- [ ] T002 Initialize Node.js project with package.json and install core dependencies (React 18, TypeScript 5.x, Vite)
- [ ] T003 [P] Install Firebase SDK v9+ (firebase@10)
- [ ] T004 [P] Install UI dependencies (tailwindcss@3, @headlessui/react, @heroicons/react)
- [ ] T005 [P] Install testing dependencies (vitest, @testing-library/react, @testing-library/jest-dom)
- [ ] T006 [P] Configure TypeScript (frontend/tsconfig.json with strict mode, path aliases)
- [ ] T007 [P] Configure Vite (frontend/vite.config.ts with React plugin, test setup)
- [ ] T008 [P] Configure TailwindCSS (frontend/tailwind.config.js with preset tag colors)
- [ ] T009 [P] Configure ESLint and Prettier (frontend/.eslintrc.js, frontend/.prettierrc)
- [ ] T010 Setup Firebase project via Firebase Console (Authentication, Firestore)
- [ ] T011 Create Firebase configuration file (frontend/src/services/firebase.ts with environment variables)
- [ ] T012 Create .env.local file with Firebase credentials (frontend/.env.local)
- [ ] T013 [P] Initialize Firebase CLI and configure firebase.json
- [ ] T014 [P] Create Firestore Security Rules file (firestore.rules with validation functions)
- [ ] T015 [P] Create Firestore indexes configuration (firestore.indexes.json with composite indexes)
- [ ] T016 Deploy Firestore Security Rules and indexes to Firebase

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, services, and authentication framework that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T017 [P] Define TypeScript types for User (frontend/src/types/user.ts)
- [ ] T018 [P] Define TypeScript types for Todo (frontend/src/types/todo.ts with title, description, tagIds, timestamps)
- [ ] T019 [P] Define TypeScript types for Tag (frontend/src/types/tag.ts with name, color, timestamps)
- [ ] T020 [P] Create validation utilities (frontend/src/utils/validation.ts with validateTodoInput, validateTagInput)
- [ ] T021 [P] Create error handling utilities (frontend/src/utils/errorHandling.ts with handleAuthError, handleServiceError, withRetry)
- [ ] T022 Create AuthService interface and implementation (frontend/src/services/authService.ts with 6 methods)
- [ ] T023 Write tests for AuthService (frontend/tests/unit/services/authService.test.ts)
- [ ] T024 Implement AuthService methods (signUpWithEmail, signInWithEmail, signInWithGoogle, signOut, getCurrentUser, onAuthStateChanged)
- [ ] T025 Create useAuth hook (frontend/src/hooks/useAuth.ts with authentication state management)
- [ ] T026 Write tests for useAuth hook (frontend/tests/unit/hooks/useAuth.test.ts)
- [ ] T027 Implement useAuth hook with AuthService integration
- [ ] T028 Create AuthContext for global auth state (frontend/src/contexts/AuthContext.tsx)
- [ ] T029 [P] Create toast notification service interface (frontend/src/services/toastService.ts with success, error, warning, info)
- [ ] T030 [P] Implement toast notification component (frontend/src/components/ui/Toast.tsx with TailwindCSS)
- [ ] T031 [P] Create layout components (frontend/src/components/layout/Header.tsx, frontend/src/components/layout/MainLayout.tsx)
- [ ] T032 Create login page (frontend/src/pages/LoginPage.tsx with email/password and Google sign-in)
- [ ] T033 Write tests for LoginPage (frontend/tests/integration/pages/LoginPage.test.tsx)
- [ ] T034 Implement LoginPage with form validation and error handling
- [ ] T035 Create signup page (frontend/src/pages/SignupPage.tsx)
- [ ] T036 Write tests for SignupPage (frontend/tests/integration/pages/SignupPage.test.tsx)
- [ ] T037 Implement SignupPage with email/password registration
- [ ] T038 Setup React Router with protected routes (frontend/src/App.tsx with authentication guards)
- [ ] T039 Configure Firebase Emulator Suite (firebase.json with Firestore and Auth emulators)
- [ ] T040 Setup test environment with Firebase emulators (frontend/tests/setup.ts)

**Checkpoint**: Foundation ready - authentication works, user story implementation can now begin

---

## Phase 3: User Story 1 - 基本的なTodo作成と閲覧 (Priority: P1) 🎯 MVP

**Goal**: ユーザーが新しいTodoを作成し、作成したTodoを一覧で確認できる

**Independent Test**: ユーザーが新しいTodoを追加し、追加したTodoが一覧に表示されることで独立して検証可能

**Acceptance Criteria**:
- FR-001: Todoを作成できる（タイトルと説明）
- FR-002: Todo一覧を閲覧できる
- FR-014: 作成日時降順で表示
- FR-017: 空状態メッセージ表示

### Tests for User Story 1 (TDD - Write First)

- [ ] T041 [P] [US1] Write contract tests for TodoService.createTodo in frontend/tests/unit/services/todoService.test.ts
- [ ] T042 [P] [US1] Write contract tests for TodoService.subscribeTodos in frontend/tests/unit/services/todoService.test.ts
- [ ] T043 [P] [US1] Write integration tests for Todo creation flow in frontend/tests/integration/todo/createTodo.test.tsx
- [ ] T044 [P] [US1] Write integration tests for Todo list display in frontend/tests/integration/todo/todoList.test.tsx
- [ ] T045 [P] [US1] Verify all tests FAIL before implementation

### Implementation for User Story 1

- [ ] T046 Create TodoService interface and skeleton (frontend/src/services/todoService.ts with createTodo, subscribeTodos methods)
- [ ] T047 Implement TodoService.createTodo with Firestore addDoc and retry logic (frontend/src/services/todoService.ts)
- [ ] T048 Implement TodoService.subscribeTodos with Firestore onSnapshot (frontend/src/services/todoService.ts)
- [ ] T049 Run tests to verify TodoService.createTodo passes (T041)
- [ ] T050 Run tests to verify TodoService.subscribeTodos passes (T042)
- [ ] T051 Create useTodos hook (frontend/src/hooks/useTodos.ts with real-time subscription)
- [ ] T052 Write tests for useTodos hook (frontend/tests/unit/hooks/useTodos.test.ts)
- [ ] T053 Implement useTodos hook with TodoService integration and auto-unsubscribe
- [ ] T054 [P] Create TodoListItem component (frontend/src/components/todos/TodoListItem.tsx)
- [ ] T055 [P] Write tests for TodoListItem component (frontend/tests/unit/components/todos/TodoListItem.test.tsx)
- [ ] T056 [P] Create EmptyState component (frontend/src/components/ui/EmptyState.tsx with message and action button)
- [ ] T057 Create TodoList component (frontend/src/components/todos/TodoList.tsx with sorting by createdAt desc)
- [ ] T058 Write tests for TodoList component (frontend/tests/unit/components/todos/TodoList.test.tsx)
- [ ] T059 Implement TodoList component with useTodos hook and EmptyState
- [ ] T060 Create CreateTodoForm component (frontend/src/components/todos/CreateTodoForm.tsx with title and description inputs)
- [ ] T061 Write tests for CreateTodoForm component (frontend/tests/unit/components/todos/CreateTodoForm.test.tsx)
- [ ] T062 Implement CreateTodoForm with validation (1-100 chars title, 0-1000 chars description)
- [ ] T063 Create CreateTodoModal component (frontend/src/components/todos/CreateTodoModal.tsx with Headless UI Dialog)
- [ ] T064 Create TodoListPage (frontend/src/pages/TodoListPage.tsx with TodoList and CreateTodoModal)
- [ ] T065 Write tests for TodoListPage (frontend/tests/integration/pages/TodoListPage.test.tsx)
- [ ] T066 Implement TodoListPage with authentication check and loading states
- [ ] T067 Add TodoListPage route to React Router (frontend/src/App.tsx)
- [ ] T068 Run all User Story 1 integration tests (T043, T044)
- [ ] T069 Verify tests pass and Todo creation/display works end-to-end

**Checkpoint**: User Story 1 complete - Users can create and view Todos with real-time updates

---

## Phase 4: User Story 2 - Todoの編集と削除 (Priority: P1)

**Goal**: ユーザーが既存のTodoを編集または削除できる

**Independent Test**: ユーザーが既存のTodoを編集または削除し、変更が即座に反映されることで検証可能

**Acceptance Criteria**:
- FR-003: Todoを編集できる
- FR-004: Todoを削除できる
- FR-005: 削除確認ダイアログ表示
- FR-016: エラー時にトースト通知と3回リトライ

### Tests for User Story 2 (TDD - Write First)

- [ ] T070 [P] [US2] Write contract tests for TodoService.updateTodo in frontend/tests/unit/services/todoService.test.ts
- [ ] T071 [P] [US2] Write contract tests for TodoService.deleteTodo in frontend/tests/unit/services/todoService.test.ts
- [ ] T072 [P] [US2] Write integration tests for Todo editing flow in frontend/tests/integration/todo/editTodo.test.tsx
- [ ] T073 [P] [US2] Write integration tests for Todo deletion flow in frontend/tests/integration/todo/deleteTodo.test.tsx
- [ ] T074 [P] [US2] Verify all tests FAIL before implementation

### Implementation for User Story 2

- [ ] T075 Implement TodoService.updateTodo with Firestore updateDoc and retry logic (frontend/src/services/todoService.ts)
- [ ] T076 Implement TodoService.deleteTodo with Firestore deleteDoc and retry logic (frontend/src/services/todoService.ts)
- [ ] T077 Run tests to verify TodoService.updateTodo passes (T070)
- [ ] T078 Run tests to verify TodoService.deleteTodo passes (T071)
- [ ] T079 Add updateTodo and deleteTodo methods to useTodos hook (frontend/src/hooks/useTodos.ts)
- [ ] T080 Write tests for new useTodos methods (frontend/tests/unit/hooks/useTodos.test.ts)
- [ ] T081 Implement useTodos update/delete with error handling and toast notifications
- [ ] T082 [P] Create EditTodoForm component (frontend/src/components/todos/EditTodoForm.tsx)
- [ ] T083 [P] Write tests for EditTodoForm component (frontend/tests/unit/components/todos/EditTodoForm.test.tsx)
- [ ] T084 [P] Create EditTodoModal component (frontend/src/components/todos/EditTodoModal.tsx with Headless UI Dialog)
- [ ] T085 [P] Create ConfirmDialog component (frontend/src/components/ui/ConfirmDialog.tsx with Headless UI Dialog)
- [ ] T086 [P] Write tests for ConfirmDialog component (frontend/tests/unit/components/ui/ConfirmDialog.test.tsx)
- [ ] T087 Add edit button to TodoListItem component (frontend/src/components/todos/TodoListItem.tsx)
- [ ] T088 Add delete button to TodoListItem component with confirmation (frontend/src/components/todos/TodoListItem.tsx)
- [ ] T089 Update TodoListItem tests for edit/delete buttons (frontend/tests/unit/components/todos/TodoListItem.test.tsx)
- [ ] T090 Integrate EditTodoModal and ConfirmDialog into TodoListPage (frontend/src/pages/TodoListPage.tsx)
- [ ] T091 Run all User Story 2 integration tests (T072, T073)
- [ ] T092 Verify tests pass and Todo edit/delete works with confirmation dialog

**Checkpoint**: User Stories 1 AND 2 complete - Full CRUD operations for Todos work independently

---

## Phase 5: User Story 3 - リアルタイム同期 (Priority: P1)

**Goal**: 複数のクライアント間でTodoの変更がリアルタイムに同期される

**Independent Test**: 2つのクライアントを開き、一方でTodoを作成・編集・削除したときに、もう一方のクライアントに即座に反映されることで検証可能

**Acceptance Criteria**:
- FR-006: 100ms以内に同期
- Constitution Principle I: Real-time sync is core value

### Tests for User Story 3 (TDD - Write First)

- [ ] T093 [P] [US3] Write E2E tests for real-time Todo creation sync in frontend/tests/e2e/realtimeSync.test.ts
- [ ] T094 [P] [US3] Write E2E tests for real-time Todo update sync in frontend/tests/e2e/realtimeSync.test.ts
- [ ] T095 [P] [US3] Write E2E tests for real-time Todo deletion sync in frontend/tests/e2e/realtimeSync.test.ts
- [ ] T096 [P] [US3] Write performance tests for sync latency (<100ms) in frontend/tests/performance/syncLatency.test.ts
- [ ] T097 [P] [US3] Verify all tests FAIL before implementation

### Implementation for User Story 3

- [ ] T098 Add performance monitoring to TodoService.subscribeTodos (frontend/src/services/todoService.ts with logSyncLatency)
- [ ] T099 Create performance monitoring utility (frontend/src/utils/performanceMonitoring.ts with Firebase Performance SDK)
- [ ] T100 Implement sync latency tracking in useTodos hook (frontend/src/hooks/useTodos.ts)
- [ ] T101 Add visual indicator for sync status (frontend/src/components/ui/SyncIndicator.tsx)
- [ ] T102 Write tests for SyncIndicator component (frontend/tests/unit/components/ui/SyncIndicator.test.tsx)
- [ ] T103 Integrate SyncIndicator into MainLayout (frontend/src/components/layout/MainLayout.tsx)
- [ ] T104 Setup Playwright for E2E testing (frontend/tests/e2e/playwright.config.ts)
- [ ] T105 Install Playwright dependencies (npm install -D @playwright/test)
- [ ] T106 Run all User Story 3 E2E tests (T093, T094, T095)
- [ ] T107 Run performance tests to verify <100ms sync latency (T096)
- [ ] T108 Verify multi-client sync works with Firebase Emulator

**Checkpoint**: All P1 user stories complete - Core Todo management with real-time sync functional

---

## Phase 6: User Story 4 - タグの作成と管理 (Priority: P2)

**Goal**: ユーザーが新しいタグを作成し、既存のタグを編集・削除できる

**Independent Test**: ユーザーがタグを作成・編集・削除し、タグ一覧に正しく反映されることで検証可能

**Acceptance Criteria**:
- FR-007: タグを作成できる（名前と8-12色のプリセットカラー）
- FR-008: タグを編集できる
- FR-009: タグを削除できる
- FR-013: タグ削除時にTodoから自動削除

### Tests for User Story 4 (TDD - Write First)

- [ ] T109 [P] [US4] Write contract tests for TagService.createTag in frontend/tests/unit/services/tagService.test.ts
- [ ] T110 [P] [US4] Write contract tests for TagService.updateTag in frontend/tests/unit/services/tagService.test.ts
- [ ] T111 [P] [US4] Write contract tests for TagService.deleteTag in frontend/tests/unit/services/tagService.test.ts
- [ ] T112 [P] [US4] Write contract tests for TagService.subscribeTags in frontend/tests/unit/services/tagService.test.ts
- [ ] T113 [P] [US4] Write integration tests for Tag CRUD operations in frontend/tests/integration/tag/tagCrud.test.tsx
- [ ] T114 [P] [US4] Verify all tests FAIL before implementation

### Implementation for User Story 4

- [ ] T115 Create TagService interface and skeleton (frontend/src/services/tagService.ts with 5 methods)
- [ ] T116 Implement TagService.createTag with Firestore addDoc and duplicate name check (frontend/src/services/tagService.ts)
- [ ] T117 Implement TagService.updateTag with Firestore updateDoc (frontend/src/services/tagService.ts)
- [ ] T118 Implement TagService.deleteTag with cascade delete from Todos (frontend/src/services/tagService.ts using batch operations)
- [ ] T119 Implement TagService.subscribeTags with Firestore onSnapshot (frontend/src/services/tagService.ts)
- [ ] T120 Run tests to verify TagService methods pass (T109, T110, T111, T112)
- [ ] T121 Create useTags hook (frontend/src/hooks/useTags.ts with real-time subscription)
- [ ] T122 Write tests for useTags hook (frontend/tests/unit/hooks/useTags.test.ts)
- [ ] T123 Implement useTags hook with TagService integration
- [ ] T124 [P] Create COLOR_PALETTE constant with 10 preset colors (frontend/src/types/tag.ts)
- [ ] T125 [P] Create ColorPicker component (frontend/src/components/tags/ColorPicker.tsx with TailwindCSS color swatches)
- [ ] T126 [P] Write tests for ColorPicker component (frontend/tests/unit/components/tags/ColorPicker.test.tsx)
- [ ] T127 [P] Create TagBadge component (frontend/src/components/tags/TagBadge.tsx for displaying tag with color)
- [ ] T128 [P] Write tests for TagBadge component (frontend/tests/unit/components/tags/TagBadge.test.tsx)
- [ ] T129 Create CreateTagForm component (frontend/src/components/tags/CreateTagForm.tsx with name input and ColorPicker)
- [ ] T130 Write tests for CreateTagForm component (frontend/tests/unit/components/tags/CreateTagForm.test.tsx)
- [ ] T131 Implement CreateTagForm with validation (1-30 chars, duplicate name check)
- [ ] T132 Create CreateTagModal component (frontend/src/components/tags/CreateTagModal.tsx)
- [ ] T133 Create EditTagForm component (frontend/src/components/tags/EditTagForm.tsx)
- [ ] T134 Write tests for EditTagForm component (frontend/tests/unit/components/tags/EditTagForm.test.tsx)
- [ ] T135 Create EditTagModal component (frontend/src/components/tags/EditTagModal.tsx)
- [ ] T136 Create TagList component (frontend/src/components/tags/TagList.tsx)
- [ ] T137 Write tests for TagList component (frontend/tests/unit/components/tags/TagList.test.tsx)
- [ ] T138 Implement TagList with edit/delete buttons and confirmation dialog
- [ ] T139 Create TagManagementPage (frontend/src/pages/TagManagementPage.tsx)
- [ ] T140 Add TagManagementPage route to React Router (frontend/src/App.tsx)
- [ ] T141 Add navigation link to TagManagementPage in Header (frontend/src/components/layout/Header.tsx)
- [ ] T142 Run all User Story 4 integration tests (T113)
- [ ] T143 Verify cascade delete works when tag is deleted (check Todos lose the tag)

**Checkpoint**: User Story 4 complete - Tag management works independently

---

## Phase 7: User Story 5 - Todoへのタグ付け (Priority: P2)

**Goal**: ユーザーはTodoに複数のタグを付けたり、外したりできる

**Independent Test**: ユーザーがTodoに複数のタグを付け、Todoの詳細画面でタグが表示されることで検証可能

**Acceptance Criteria**:
- FR-010: Todoに複数タグを付けられる（最大20個）
- FR-011: Todoから個別にタグを外せる

### Tests for User Story 5 (TDD - Write First)

- [ ] T144 [P] [US5] Write integration tests for adding tags to Todo in frontend/tests/integration/todo/addTags.test.tsx
- [ ] T145 [P] [US5] Write integration tests for removing tags from Todo in frontend/tests/integration/todo/removeTags.test.tsx
- [ ] T146 [P] [US5] Write tests for max 20 tags validation in frontend/tests/integration/todo/tagLimits.test.tsx
- [ ] T147 [P] [US5] Verify all tests FAIL before implementation

### Implementation for User Story 5

- [ ] T148 Add tagIds field handling to CreateTodoForm (frontend/src/components/todos/CreateTodoForm.tsx)
- [ ] T149 Create TagSelector component (frontend/src/components/todos/TagSelector.tsx with multi-select checkboxes)
- [ ] T150 Write tests for TagSelector component (frontend/tests/unit/components/todos/TagSelector.test.tsx)
- [ ] T151 Implement TagSelector with useTags hook and max 20 validation
- [ ] T152 Integrate TagSelector into CreateTodoForm (frontend/src/components/todos/CreateTodoForm.tsx)
- [ ] T153 Add TagSelector to EditTodoForm (frontend/src/components/todos/EditTodoForm.tsx)
- [ ] T154 Update TodoListItem to display TagBadges (frontend/src/components/todos/TodoListItem.tsx)
- [ ] T155 Update TodoListItem tests for tag display (frontend/tests/unit/components/todos/TodoListItem.test.tsx)
- [ ] T156 Create TodoDetailView component (frontend/src/components/todos/TodoDetailView.tsx with tag list)
- [ ] T157 Write tests for TodoDetailView component (frontend/tests/unit/components/todos/TodoDetailView.test.tsx)
- [ ] T158 Add quick tag add/remove buttons to TodoListItem (frontend/src/components/todos/TodoListItem.tsx)
- [ ] T159 Run all User Story 5 integration tests (T144, T145, T146)
- [ ] T160 Verify tags appear on Todos and sync across clients

**Checkpoint**: User Stories 4 AND 5 complete - Full tag system works independently

---

## Phase 8: User Story 6 - タグによる絞り込み (Priority: P3)

**Goal**: ユーザーは特定のタグが付いたTodoのみを表示するように絞り込みができる

**Independent Test**: ユーザーがタグを選択してフィルタリングし、該当するTodoのみが表示されることで検証可能

**Acceptance Criteria**:
- FR-012: タグで絞り込める
- SC-006: 1秒以内に結果表示

### Tests for User Story 6 (TDD - Write First)

- [ ] T161 [P] [US6] Write contract tests for TodoService.subscribeFilteredTodos in frontend/tests/unit/services/todoService.test.ts
- [ ] T162 [P] [US6] Write integration tests for single tag filter in frontend/tests/integration/todo/filterByTag.test.tsx
- [ ] T163 [P] [US6] Write integration tests for multiple tag filter (OR condition) in frontend/tests/integration/todo/filterByMultipleTags.test.tsx
- [ ] T164 [P] [US6] Write performance tests for filter response time (<1s) in frontend/tests/performance/filterPerformance.test.ts
- [ ] T165 [P] [US6] Verify all tests FAIL before implementation

### Implementation for User Story 6

- [ ] T166 Implement TodoService.subscribeFilteredTodos with Firestore array-contains-any query (frontend/src/services/todoService.ts)
- [ ] T167 Run tests to verify TodoService.subscribeFilteredTodos passes (T161)
- [ ] T168 Add filtered subscription support to useTodos hook (frontend/src/hooks/useTodos.ts)
- [ ] T169 Write tests for useTodos filtered subscription (frontend/tests/unit/hooks/useTodos.test.ts)
- [ ] T170 [P] Create TagFilter component (frontend/src/components/todos/TagFilter.tsx with multi-select)
- [ ] T171 [P] Write tests for TagFilter component (frontend/tests/unit/components/todos/TagFilter.test.tsx)
- [ ] T172 [P] Implement TagFilter with useTags hook and selection state
- [ ] T173 [P] Create FilterBar component (frontend/src/components/todos/FilterBar.tsx with TagFilter and clear button)
- [ ] T174 [P] Write tests for FilterBar component (frontend/tests/unit/components/todos/FilterBar.test.tsx)
- [ ] T175 Integrate FilterBar into TodoListPage (frontend/src/pages/TodoListPage.tsx)
- [ ] T176 Update TodoListPage to use filtered subscription when filters active (frontend/src/pages/TodoListPage.tsx)
- [ ] T177 Add empty state message for "該当するTodoがありません" (frontend/src/components/todos/TodoList.tsx)
- [ ] T178 Update TodoList tests for empty filter results (frontend/tests/unit/components/todos/TodoList.test.tsx)
- [ ] T179 Add filter state to URL query parameters for bookmarking (frontend/src/pages/TodoListPage.tsx)
- [ ] T180 Run all User Story 6 integration tests (T162, T163)
- [ ] T181 Run performance tests to verify <1s filter response (T164)
- [ ] T182 Verify filtering works with multiple tags (OR condition)

**Checkpoint**: All user stories (US1-US6) complete - Full feature set functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T183 [P] Add loading skeletons to TodoList (frontend/src/components/todos/TodoListSkeleton.tsx)
- [ ] T184 [P] Add loading spinners to forms during submission (frontend/src/components/ui/Spinner.tsx)
- [ ] T185 [P] Improve error messages with user-friendly text (frontend/src/utils/errorHandling.ts)
- [ ] T186 [P] Add keyboard shortcuts (Cmd+K to create Todo, Esc to close modals)
- [ ] T187 [P] Implement responsive design for mobile devices (TailwindCSS breakpoints)
- [ ] T188 [P] Add accessibility attributes (ARIA labels, keyboard navigation)
- [ ] T189 [P] Optimize bundle size with code splitting (React.lazy for pages)
- [ ] T190 [P] Add analytics tracking for key user actions (Firebase Analytics)
- [ ] T191 [P] Create user documentation in docs/user-guide.md
- [ ] T192 [P] Create developer documentation in docs/developer-guide.md
- [ ] T193 Add CI/CD workflow (frontend/.github/workflows/ci.yml with lint, test, build)
- [ ] T194 Setup GitHub Actions for automated testing on PRs
- [ ] T195 Configure Firebase Hosting deployment pipeline
- [ ] T196 Run full test suite (unit + integration + E2E)
- [ ] T197 Run performance benchmarks and optimize if needed
- [ ] T198 Security audit of Firebase Security Rules
- [ ] T199 Accessibility audit with axe-core
- [ ] T200 Follow quickstart.md validation steps (all 8 verification steps)
- [ ] T201 Deploy to Firebase Hosting staging environment
- [ ] T202 Perform manual QA testing with multiple browsers
- [ ] T203 Fix any bugs found during QA
- [ ] T204 Deploy to production

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Foundational - Can start after Phase 2
- **US2 (Phase 4)**: Depends on Foundational - Can start after Phase 2 (integrates with US1 but independently testable)
- **US3 (Phase 5)**: Depends on US1, US2 - Real-time sync testing requires CRUD operations
- **US4 (Phase 6)**: Depends on Foundational - Can start after Phase 2 (independent of Todos)
- **US5 (Phase 7)**: Depends on US1, US4 - Requires both Todos and Tags to exist
- **US6 (Phase 8)**: Depends on US1, US4, US5 - Requires Todos with tags
- **Polish (Phase 9)**: Depends on desired user stories being complete

### User Story Dependencies

```
Foundational (Phase 2)
    ├─> US1: Todo CRUD (P1) ────┐
    │                           ├─> US3: Real-time Sync (P1)
    ├─> US2: Edit/Delete (P1) ──┘
    │
    └─> US4: Tag CRUD (P2) ─────┬─> US5: Tag Assignment (P2) ──> US6: Tag Filter (P3)
                               │
                               └─> US1 (for cascade delete)
```

### Critical Path (Minimum Viable Product)

For MVP, complete in order:
1. Phase 1: Setup
2. Phase 2: Foundational (**CRITICAL - blocks everything**)
3. Phase 3: US1 (Todo CRUD) (**MVP Core**)
4. Phase 4: US2 (Edit/Delete) (**MVP Core**)
5. Phase 5: US3 (Real-time Sync) (**MVP Core - Constitution Principle**)
6. Deploy MVP with P1 features (US1, US2, US3)

### Parallel Opportunities

**Within Setup (Phase 1)**:
- T003, T004, T005 (dependencies installation)
- T006, T007, T008, T009 (configuration files)
- T013, T014, T015 (Firebase files)

**Within Foundational (Phase 2)**:
- T017, T018, T019 (type definitions)
- T020, T021 (utilities)
- T029, T030, T031 (UI components)

**Across User Stories (after Foundational complete)**:
- US1 and US4 can be developed in parallel (no dependencies)
- US2 can start while US1 is in progress (same files but different methods)

**Within Each User Story**:
- All test tasks marked [P] can run in parallel
- Component tests marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Write all tests for User Story 1 together:
T041: "Contract test for TodoService.createTodo"
T042: "Contract test for TodoService.subscribeTodos"
T043: "Integration test for Todo creation flow"
T044: "Integration test for Todo list display"

# Build components in parallel:
T054: "TodoListItem component"
T056: "EmptyState component"
```

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

**Goal**: Ship working realtime Todo app ASAP

1. ✅ Complete Phase 1: Setup (T001-T016)
2. ✅ Complete Phase 2: Foundational (T017-T040) **← CRITICAL GATE**
3. ✅ Complete Phase 3: US1 - Todo CRUD (T041-T069)
4. ✅ Complete Phase 4: US2 - Edit/Delete (T070-T092)
5. ✅ Complete Phase 5: US3 - Real-time Sync (T093-T108)
6. **STOP and VALIDATE**: Test P1 features end-to-end
7. Deploy MVP to staging → Production

**MVP Delivers**:
- ✅ User authentication (email/password, Google)
- ✅ Create, read, update, delete Todos
- ✅ Real-time sync across clients (<100ms)
- ✅ Error handling with retry logic
- ✅ Empty states and validation

### Incremental Delivery (Add P2, P3 Features)

**After MVP deployed**:

1. ✅ Complete Phase 6: US4 - Tag Management (T109-T143)
2. ✅ Complete Phase 7: US5 - Tag Assignment (T144-T160)
3. **STOP and VALIDATE**: Test P2 features
4. Deploy P2 update

5. ✅ Complete Phase 8: US6 - Tag Filtering (T161-T182)
6. **STOP and VALIDATE**: Test P3 features
7. Deploy P3 update

8. ✅ Complete Phase 9: Polish (T183-T204)
9. Final production deployment

**Each deployment is independently functional - no broken features**

### Parallel Team Strategy

With 3 developers after Foundational phase:

- **Developer A**: US1, US2, US3 (P1 - MVP critical path)
- **Developer B**: US4 (P2 - Tag CRUD, independent of Todos)
- **Developer C**: Setup CI/CD, documentation (Phase 9 tasks)

Once Developer A completes US1:
- **Developer B**: Can start US5 (depends on US1 + US4)
- **Developer C**: Can start US6 (depends on US1, US4, US5)

**Benefit**: Faster time to market, independent story validation

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to user story for traceability
- **TDD is NON-NEGOTIABLE**: Write tests first, verify they FAIL, then implement
- **Independent stories**: Each user story should be completable and testable on its own
- **Commit strategy**: Commit after each task or logical group
- **Checkpoints**: Stop at each checkpoint to validate story independently
- **Constitution compliance**: US3 (real-time sync) is critical - cannot skip
- **Firebase Emulator**: Use for local development (Section 5 in quickstart.md)
- **Performance targets**: Monitor sync latency (<100ms), filter speed (<1s), initial load (<3s)

---

## Task Summary

**Total Tasks**: 204  
**Setup**: 16 tasks  
**Foundational**: 24 tasks (BLOCKS all user stories)  
**User Story 1 (P1)**: 29 tasks (MVP core)  
**User Story 2 (P1)**: 23 tasks (MVP core)  
**User Story 3 (P1)**: 16 tasks (MVP core)  
**User Story 4 (P2)**: 35 tasks  
**User Story 5 (P2)**: 17 tasks  
**User Story 6 (P3)**: 22 tasks  
**Polish**: 22 tasks  

**MVP Scope** (P1 only): T001-T108 = **108 tasks**  
**Full Feature Set** (P1+P2+P3): All 204 tasks  

**Parallel Opportunities**: 47 tasks marked [P] across all phases  

**Independent Test Criteria**:
- ✅ US1: Add Todo, see it in list
- ✅ US2: Edit/delete Todo, changes reflect immediately
- ✅ US3: Open 2 clients, changes sync in <100ms
- ✅ US4: Create/edit/delete tag, tag list updates
- ✅ US5: Add tag to Todo, see TagBadge on Todo
- ✅ US6: Select tag filter, see only matching Todos

**Suggested MVP**: US1 + US2 + US3 (Core Todo management with real-time sync)
