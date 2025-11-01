# Data Model: リアルタイムTodo管理

**Feature**: 001-realtime-todo-crud  
**Date**: 2025-10-29  
**Phase**: 1 - Data Model Design

## Overview

FirestoreのドキュメントベースNoSQLデータベースを使用したデータモデル設計。ユーザーごとにサブコレクションでTodoとTagを分離し、セキュリティルールとクエリの最適化を実現。

## Collection Structure

```
/users/{userId}
  ├── /todos/{todoId}
  └── /tags/{tagId}
```

## Entities

### User

**Collection Path**: `/users/{userId}`

ユーザーの基本情報を保存。認証はFirebase Authenticationで管理され、ここでは表示名やプロフィール情報を保持。

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | ユーザーID（Firebase Auth UID） | Firebase Auth管理 |
| `email` | string | Yes | メールアドレス | Firebase Auth管理 |
| `displayName` | string | No | 表示名 | 1-50文字 |
| `photoURL` | string | No | プロフィール画像URL | 有効なURL形式 |
| `createdAt` | timestamp | Yes | アカウント作成日時 | 自動設定 |
| `updatedAt` | timestamp | Yes | 最終更新日時 | 自動設定 |

**Indexes**: なし（ユーザードキュメントは直接IDで参照）

**Example**:
```json
{
  "id": "user123",
  "email": "user@example.com",
  "displayName": "太郎",
  "photoURL": "https://...",
  "createdAt": "2025-10-29T10:00:00Z",
  "updatedAt": "2025-10-29T10:00:00Z"
}
```

---

### Todo

**Collection Path**: `/users/{userId}/todos/{todoId}`

ユーザーのタスクを表すメインエンティティ。

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | Todo ID（自動生成） | Firestore auto-ID |
| `title` | string | Yes | Todoのタイトル | 1-100文字 |
| `description` | string | No | Todoの詳細説明 | 0-1000文字 |
| `tagIds` | string[] | No | 関連付けられたタグIDの配列 | 最大20個 |
| `createdAt` | timestamp | Yes | 作成日時 | 自動設定 |
| `updatedAt` | timestamp | Yes | 最終更新日時 | 自動設定 |
| `userId` | string | Yes | 所有者のユーザーID | Parent collection参照 |

**Indexes**:
- Composite Index: `(createdAt DESC)` - Todo一覧の降順ソート用

**Relationships**:
- `userId` → `/users/{userId}` (Parent)
- `tagIds[]` → `/users/{userId}/tags/{tagId}` (Many-to-Many)

**Example**:
```json
{
  "id" "todo-abc123",
  "title": "プロジェクト提案書を作成",
  "description": "来週の会議で使用する提案書のドラフトを完成させる",
  "tagIds": ["tag-work", "tag-urgent"],
  "createdAt": "2025-10-29T10:30:00Z",
  "updatedAt": "2025-10-29T11:00:00Z",
  "userId": "user123"
}
```

**State Transitions**: なし（完了機能は将来バージョン）

---

### Tag

**Collection Path**: `/users/{userId}/tags/{tagId}`

Todoを分類するためのラベル。

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `id` | string | Yes | タグID（自動生成） | Firestore auto-ID |
| `name` | string | Yes | タグ名 | 1-30文字、同一ユーザー内でユニーク |
| `color` | string | Yes | タグの色（プリセットから選択） | `COLOR_PALETTE`から選択 |
| `createdAt` | timestamp | Yes | 作成日時 | 自動設定 |
| `userId` | string | Yes | 所有者のユーザーID | Parent collection参照 |

**Indexes**:
- Single Index: `(name ASC)` - タグ名での検索・並び替え用

**Relationships**:
- `userId` → `/users/{userId}` (Parent)
- Referenced by: `/users/{userId}/todos/{todoId}.tagIds[]`

**Color Palette** (10色):
```typescript
const COLOR_PALETTE = {
  RED: '#EF4444',      // Tailwind red-500
  ORANGE: '#F97316',   // Tailwind orange-500
  YELLOW: '#EAB308',   // Tailwind yellow-500
  GREEN: '#22C55E',    // Tailwind green-500
  TEAL: '#14B8A6',     // Tailwind teal-500
  BLUE: '#3B82F6',     // Tailwind blue-500
  INDIGO: '#6366F1',   // Tailwind indigo-500
  PURPLE: '#A855F7',   // Tailwind purple-500
  PINK: '#EC4899',     // Tailwind pink-500
  GRAY: '#6B7280'      // Tailwind gray-500
} as const;
```

**Example**:
```json
{
  "id": "tag-work",
  "name": "仕事",
  "color": "#3B82F6",
  "createdAt": "2025-10-29T10:00:00Z",
  "userId": "user123"
}
```

---

## Validation Rules

### Todo Validation

```typescript
interface TodoValidation {
  title: {
    minLength: 1,
    maxLength: 100,
    required: true
  },
  description: {
    minLength: 0,
    maxLength: 1000,
    required: false
  },
  tagIds: {
    maxItems: 20,
    required: false,
    itemType: 'string'
  }
}
```

### Tag Validation

```typescript
interface TagValidation {
  name: {
    minLength: 1,
    maxLength: 30,
    required: true,
    unique: true // 同一ユーザー内
  },
  color: {
    required: true,
    enum: Object.values(COLOR_PALETTE)
  }
}
```

## Query Patterns

### 1. Todo一覧取得（作成日時降順）

```typescript
const todosRef = collection(db, `users/${userId}/todos`);
const q = query(todosRef, orderBy('createdAt', 'desc'));
const unsubscribe = onSnapshot(q, (snapshot) => {
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setTodos(todos);
});
```

**Required Index**: `(createdAt DESC)`

### 2. タグによるTodo絞り込み

```typescript
const todosRef = collection(db, `users/${userId}/todos`);
const q = query(
  todosRef,
  where('tagIds', 'array-contains-any', selectedTagIds),
  orderBy('createdAt', 'desc')
);
const unsubscribe = onSnapshot(q, (snapshot) => {
  const filteredTodos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setFilteredTodos(filteredTodos);
});
```

**Required Index**: Composite `(tagIds, createdAt DESC)`  
**Limitation**: `array-contains-any` は最大10個のタグIDまで

### 3. タグ一覧取得（名前順）

```typescript
const tagsRef = collection(db, `users/${userId}/tags`);
const q = query(tagsRef, orderBy('name', 'asc'));
const unsubscribe = onSnapshot(q, (snapshot) => {
  const tags = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setTags(tags);
});
```

**Required Index**: `(name ASC)`

### 4. 単一Todo取得

```typescript
const todoRef = doc(db, `users/${userId}/todos/${todoId}`);
const unsubscribe = onSnapshot(todoRef, (snapshot) => {
  if (snapshot.exists()) {
    setTodo({ id: snapshot.id, ...snapshot.data() });
  }
});
```

**No Index Required**: 直接ドキュメント参照

## CRUD Operations

### Todo作成

```typescript
async function createTodo(userId: string, todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  const todosRef = collection(db, `users/${userId}/todos`);
  const newTodo = {
    ...todo,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(todosRef, newTodo);
  return docRef.id;
}
```

### Todo更新

```typescript
async function updateTodo(userId: string, todoId: string, updates: Partial<Todo>) {
  const todoRef = doc(db, `users/${userId}/todos/${todoId}`);
  await updateDoc(todoRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}
```

### Todo削除

```typescript
async function deleteTodo(userId: string, todoId: string) {
  const todoRef = doc(db, `users/${userId}/todos/${todoId}`);
  await deleteDoc(todoRef);
}
```

### タグ削除（カスケード処理）

```typescript
async function deleteTag(userId: string, tagId: string) {
  // 1. タグを使用しているTodoを取得
  const todosRef = collection(db, `users/${userId}/todos`);
  const q = query(todosRef, where('tagIds', 'array-contains', tagId));
  const snapshot = await getDocs(q);
  
  // 2. 各TodoからtagIdを削除
  const batch = writeBatch(db);
  snapshot.docs.forEach(doc => {
    const todoRef = doc.ref;
    const tagIds = (doc.data().tagIds || []).filter(id => id !== tagId);
    batch.update(todoRef, { tagIds, updatedAt: serverTimestamp() });
  });
  
  // 3. タグ自体を削除
  const tagRef = doc(db, `users/${userId}/tags/${tagId}`);
  batch.delete(tagRef);
  
  // 4. バッチコミット
  await batch.commit();
}
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
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
    
    // User document
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create, update: if isOwner(userId);
      
      // Todos subcollection
      match /todos/{todoId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId) && validateTodo();
        allow update: if isOwner(userId) && validateTodo();
        allow delete: if isOwner(userId);
      }
      
      // Tags subcollection
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

## Performance Considerations

### Read Optimization
- **Real-time Listeners**: `onSnapshot()` で効率的なデータ同期
- **Pagination**: 初期は全件取得、将来的に `limit()` + `startAfter()` で実装

### Write Optimization
- **Batch Writes**: タグ削除時のカスケード更新はbatchで実行（最大500件）
- **Transaction**: 競合が発生しやすい操作では `runTransaction()` を使用

### Cost Optimization
- **Free Tier Limits**: 
  - 読み取り: 50,000/日
  - 書き込み: 20,000/日
  - 削除: 20,000/日
- **見積もり**: 10ユーザー × 100Todo × 10回/日 = 10,000読み取り/日（余裕あり）

## Migration Strategy

初期バージョンのため、マイグレーションは不要。将来のスキーマ変更時は：

1. **フィールド追加**: 既存ドキュメントは読み取り時にデフォルト値を適用
2. **フィールド削除**: 新規作成時にフィールドを含めない（既存は放置）
3. **フィールド型変更**: Cloud Functionsでバッチ更新

## TypeScript Types

```typescript
// src/types/todo.ts
export interface Todo {
  id: string;
  title: string;
  description?: string;
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// src/types/tag.ts
export const COLOR_PALETTE = {
  RED: '#EF4444',
  ORANGE: '#F97316',
  YELLOW: '#EAB308',
  GREEN: '#22C55E',
  TEAL: '#14B8A6',
  BLUE: '#3B82F6',
  INDIGO: '#6366F1',
  PURPLE: '#A855F7',
  PINK: '#EC4899',
  GRAY: '#6B7280'
} as const;

export type TagColor = typeof COLOR_PALETTE[keyof typeof COLOR_PALETTE];

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
  createdAt: Date;
  userId: string;
}

// src/types/user.ts
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}
```
