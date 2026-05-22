import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => storage.get(key, initialValue));

  const setValue = useCallback(
    (value) => {
      const next = typeof value === 'function' ? value(stored) : value;
      setStored(next);
      storage.set(key, next);
    },
    [key, stored]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'smart_hospital_' + key) {
        setStored(storage.get(key, initialValue));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, initialValue]);

  return [stored, setValue];
}
