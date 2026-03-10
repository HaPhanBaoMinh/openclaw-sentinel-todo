import { useReducer, useEffect, useState } from 'react';
import { todoReducer, initialTodoState } from './todoReducer';
import { loadState, saveState } from './localStorageManager';
import type { Todo } from './types';

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState, (init) => {
    const persistedState = loadState();
    return persistedState ? persistedState : init;
  });
  const [input, setInput] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addTodo = () => {
    if (input.trim()) {
      dispatch({ type: 'ADD_TODO', payload: input });
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-5xl font-bold text-gray-800 mb-8">Todo Professional Edition</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Todo
          </button>
        </div>
        <ul>
          {state.todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0"
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
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`text-lg cursor-pointer ${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                  <div>
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
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
