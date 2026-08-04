import { useState, useEffect } from 'react';

// Key namespace & version mặc định theo quy định
const STORAGE_PREFIX = 'traintrack_v1_';

export function useLocalStorage(key, initialValue) {
  const fullKey = STORAGE_PREFIX + key;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Lỗi đọc localStorage key "${fullKey}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (storedValue === undefined || storedValue === null) {
        window.localStorage.removeItem(fullKey);
      } else {
        window.localStorage.setItem(fullKey, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Lỗi ghi localStorage key "${fullKey}":`, error);
    }
  }, [fullKey, storedValue]);

  return [storedValue, setStoredValue];
}