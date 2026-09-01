import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state to localStorage.
 * Falls back to defaultValue when localStorage is unavailable or empty.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Failed to save "${key}" to localStorage:`, err);
    }
  }, [key, value]);

  return [value, setValue];
}
