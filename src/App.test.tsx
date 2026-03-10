import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the Todo App heading', () => {
    render(<App />);
    expect(screen.getByText(/Todo App/i)).toBeInTheDocument();
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

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText(/Do laundry/i)).not.toBeInTheDocument();
  });
});
