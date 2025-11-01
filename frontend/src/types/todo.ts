export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  tagIds?: string[];
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
  tagIds?: string[];
}