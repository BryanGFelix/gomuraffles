// components/ToastManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Toast from './Toast';
import styles from './ToastManager.module.css';

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

let toastId = 0;
const toasts: Toast[] = [];

const ToastManager: React.FC = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const id = toastId++;
    const newToast: Toast = { id, message, type };
    toasts.push(newToast);
    setToastList([...toasts]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    const index = toasts.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      setToastList([...toasts]);
    }
  }, []);

  useEffect(() => {
    (window as any).addToast = addToast;
  }, [addToast]);

  return (
    <div className={styles.toastContainer}>
      {toastList.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
};

export default ToastManager;
