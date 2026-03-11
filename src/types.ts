export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
  deadline?: string;
}

export interface TodoState {
  todos: Todo[];
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string; createdAt: number; priority: Priority; deadline?: string } }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'EDIT_TODO'; payload: { id: number; newText: string } };

