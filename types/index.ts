export interface Todo {
  _id: string;
  _creationTime: number;
  title: string;
  completed: boolean;
  createdAt: number;
  order: number;
}

export type ThemeMode = 'light' | 'dark';