import { useReducer, useEffect, useState, useMemo } from 'react';
import { todoReducer, initialTodoState } from './todoReducer';
import { loadState, saveState } from './localStorageManager';
import type { Todo } from './types';

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState, (init) => {
    const persistedState = loadState();
    return persistedState ? persistedState : init;
  });
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  
  // Sort state persistence
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    return (localStorage.getItem('sentinel-todo-sort') as 'asc' | 'desc') || 'desc';
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    localStorage.setItem('sentinel-todo-sort', sortOrder);
  }, [sortOrder]);

  const addTodo = () => {
    if (input.trim()) {
      dispatch({ type: 'ADD_TODO', payload: { text: input, createdAt: Date.now() } });
      setInput('');
    }
  };

  const toggleTodo = (id: number) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id: number) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const startEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = (id: number) => {
    if (editingText.trim()) {
      dispatch({ type: 'EDIT_TODO', payload: { id, newText: editingText } });
      setEditingTodoId(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditingText('');
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const processedTodos = useMemo(() => {
    let filtered = state.todos;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(todo => todo.text.toLowerCase().includes(lowerQuery));
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      const timeA = a.createdAt || a.id;
      const timeB = b.createdAt || b.id;
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [state.todos, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-5xl font-bold text-brand mb-8 font-sans">Todo Professional Edition</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand transition-micro"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
          />
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-brand text-white font-semibold rounded-r-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            Add Todo
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
          <span>{processedTodos.length} items</span>
          <button 
            onClick={toggleSort}
            className="flex items-center hover:text-brand focus:outline-none transition-micro"
            aria-label={`Sort by date ${sortOrder === 'desc' ? 'Ascending' : 'Descending'}`}
          >
            Sort: {sortOrder === 'desc' ? 'Newest First ▼' : 'Oldest First ▲'}
          </button>
        </div>

        <ul>
          {processedTodos.length === 0 && searchQuery.trim() !== '' && state.todos.length > 0 ? (
            <li className="text-center text-gray-500 py-4">No matches found</li>
          ) : (
            processedTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 transition-micro hover:bg-gray-50 group"
              >
                {editingTodoId === todo.id ? (
                  <div className="flex-grow flex items-center">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                      className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                    />
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2 transition-micro"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-micro"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="mr-3 h-5 w-5 text-brand rounded focus:ring-brand cursor-pointer transition-micro"
                      />
                      <span
                        className={`text-lg cursor-pointer transition-micro ${
                          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-micro">
                      <button
                        onClick={() => startEdit(todo)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
