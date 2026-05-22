import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

const ToastContext = createContext(null);

const initial = { toasts: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { toasts: [...state.toasts, { id: Date.now() + Math.random(), ...action.payload }] };
    case 'REMOVE':
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

export function ToastProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    dispatch({ type: 'ADD', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE', id }), duration);
  }, []);

  const value = useMemo(() => ({ toasts: state.toasts, toast }), [state.toasts, toast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
