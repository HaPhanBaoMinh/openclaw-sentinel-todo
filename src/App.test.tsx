import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  it('renders the Todo App heading', () => {
    render(<App />);
    expect(screen.getByText(/Todo Professional Edition/i)).toBeInTheDocument();
  });

  it('allows users to add a todo', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Learn Vitest' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/Learn Vitest/i)).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
  });

  it('does not add an empty todo', () => {
    render(<App />);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.click(addButton);

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('allows users to toggle a todo as completed', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);

    const todoText = screen.getByText(/Buy groceries/i);
    expect(todoText).not.toHaveClass('line-through');

    fireEvent.click(todoText);
    expect(todoText).toHaveClass('line-through');

    fireEvent.click(todoText);
    expect(todoText).not.toHaveClass('line-through');
  });

  it('allows users to delete a todo', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    fireEvent.change(inputElement, { target: { value: 'Do laundry' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/Do laundry/i)).toBeInTheDocument();

    // Since we map through list items, the specific delete button for this todo can be found by traversing the DOM.
    // However, if it's the only item, we can grab it directly.
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText(/Do laundry/i)).not.toBeInTheDocument();
  });

  it('sorts tasks chronologically based on creation time (TC-008)', () => {
    // Mock Date.now to control timestamps
    let currentTime = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      currentTime += 1000;
      return currentTime;
    });

    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });

    // Add Task 1 (Timestamp: 2000)
    fireEvent.change(inputElement, { target: { value: 'Task 1' } });
    fireEvent.click(addButton);

    // Add Task 2 (Timestamp: 3000)
    fireEvent.change(inputElement, { target: { value: 'Task 2' } });
    fireEvent.click(addButton);

    // Add Task 3 (Timestamp: 4000)
    fireEvent.change(inputElement, { target: { value: 'Task 3' } });
    fireEvent.click(addButton);

    // Verify initial sort order (Descending - Newest First)
    let listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Task 3');
    expect(listItems[1]).toHaveTextContent('Task 2');
    expect(listItems[2]).toHaveTextContent('Task 1');

    // Toggle sort order
    const sortButton = screen.getByRole('button', { name: /Sort by date/i });
    fireEvent.click(sortButton);

    // Verify new sort order (Ascending - Oldest First)
    listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Task 1');
    expect(listItems[1]).toHaveTextContent('Task 2');
    expect(listItems[2]).toHaveTextContent('Task 3');

    // Restore Date.now
    vi.restoreAllMocks();
  });

  it('filters tasks based on search query (TC-009)', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });
    const searchInput = screen.getByPlaceholderText(/Search tasks.../i);

    fireEvent.change(inputElement, { target: { value: 'Buy groceries' } });
    fireEvent.click(addButton);

    fireEvent.change(inputElement, { target: { value: 'Learn Vitest' } });
    fireEvent.click(addButton);

    // Initial state: both visible
    expect(screen.getByText(/Buy groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn Vitest/i)).toBeInTheDocument();

    // Search for 'Vitest'
    fireEvent.change(searchInput, { target: { value: 'Vitest' } });
    expect(screen.getByText(/Learn Vitest/i)).toBeInTheDocument();
    expect(screen.queryByText(/Buy groceries/i)).not.toBeInTheDocument();

    // Search for non-existent task
    fireEvent.change(searchInput, { target: { value: 'Non-existent task' } });
    expect(screen.getByText(/No matches found/i)).toBeInTheDocument();
    expect(screen.queryByText(/Learn Vitest/i)).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText(/Buy groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn Vitest/i)).toBeInTheDocument();
  });

  it('supports task priorities (TC-010)', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });
    const prioritySelect = screen.getByRole('combobox');

    // Add high priority task
    fireEvent.change(inputElement, { target: { value: 'High Priority Task' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(addButton);

    // Verify it added
    expect(screen.getByText(/High Priority Task/i)).toBeInTheDocument();
    
    // Add low priority task
    fireEvent.change(inputElement, { target: { value: 'Low Priority Task' } });
    fireEvent.change(prioritySelect, { target: { value: 'low' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/Low Priority Task/i)).toBeInTheDocument();
    
    // We can test the title attribute of the priority indicator element
    expect(screen.getByTitle('Priority: high')).toBeInTheDocument();
    expect(screen.getByTitle('Priority: low')).toBeInTheDocument();
  });

  it('supports task deadlines (TC-011)', () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const addButton = screen.getByRole('button', { name: /Add Todo/i });
    // Find the date input (the only one without placeholder/role that is type="date")
    // Wait, let's grab it by type or role if we can. Actually it's just an input[type="date"]
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;

    // Add task with deadline
    fireEvent.change(inputElement, { target: { value: 'Task with Deadline' } });
    // Set a date (e.g. 2026-03-15)
    fireEvent.change(dateInput, { target: { value: '2026-03-15' } });
    fireEvent.click(addButton);

    expect(screen.getByText(/Task with Deadline/i)).toBeInTheDocument();
    // The date should render formatted (e.g., "Mar 14, 2026" or "Mar 15, 2026" depending on timezone)
    // We will just verify the element exists and has text by looking at the parent container
    const taskText = screen.getByText(/Task with Deadline/i);
    const parentContainer = taskText.parentElement;
    expect(parentContainer).toHaveTextContent(/Mar 1[45], 2026/);
  });
});