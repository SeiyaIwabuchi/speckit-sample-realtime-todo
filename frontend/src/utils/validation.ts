export const validateTodoInput = (title: string, description?: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'タイトルは必須です';
  }
  if (title.length > 100) {
    return 'タイトルは100文字以内で入力してください';
  }
  if (description && description.length > 1000) {
    return '説明は1000文字以内で入力してください';
  }
  return null;
};

export const validateTagInput = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'タグ名は必須です';
  }
  if (name.length > 30) {
    return 'タグ名は30文字以内で入力してください';
  }
  return null;
};

export const validateTodoTags = (tagIds: string[]): string | null => {
  if (tagIds.length > 20) {
    return '1つのTodoに付けることができるタグは20個までです';
  }
  return null;
};