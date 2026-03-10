export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoState {
  todos: Todo[];
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string; createdAt: number } }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'EDIT_TODO'; payload: { id: number; newText: string } };

