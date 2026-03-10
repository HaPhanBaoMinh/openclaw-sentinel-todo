import type { TodoState } from './types';

const LOCAL_STORAGE_KEY = 'todoProfessionalEditionState';

export const loadState = (): TodoState | undefined => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as TodoState;
  } catch (error) {
    console.error("Error loading state from local storage", error);
    return undefined;
  }
};

export const saveState = (state: TodoState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Error saving state to local storage", error);
  }
};
