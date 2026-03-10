# Technical Design - Sentinel-Todo (Professional Edition)

## Architecture
The application follows a Unidirectional Data Flow pattern.
- **Framework:** React 18
- **State Management:** `useReducer` hooked up with local persistence.
- **Styling:** Tailwind CSS

## Data Models
### Todo Object
```typescript
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number; // Unix timestamp added for TASK-008
}
```

## Algorithms
### Task Sorting (TASK-008)
The task list is sorted chronologically based on the `createdAt` timestamp. If `createdAt` is missing for older tasks, it falls back to the `id` (which is also a timestamp).
- **Descending (Newest First):** `timeB - timeA`
- **Ascending (Oldest First):** `timeA - timeB`

The user's preferred sort order (`asc` or `desc`) is saved to `localStorage` under the key `sentinel-todo-sort`.

## Persistence
`LocalStorageManager` handles JSON parsing with a fail-safe that resets the data to an empty array `[]` if the stored payload is corrupted or malformed.
Cross-tab synchronization is supported by listening to the `storage` window event and dispatching a re-initialization of state.