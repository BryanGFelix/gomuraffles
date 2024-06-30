// components/ToastManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Toast from './Toast';
import styles from './ToastManager.module.css';

interface Toast {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

let toastId = 0;
const toasts: Toast[] = [];

const ToastManager: React.FC = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info', timeout = 3000, action?: { label: string; onClick: () => void }) => {
    const id = toastId++;
    const newToast: Toast = { id, message, type, action };
    toasts.push(newToast);
    setToastList([...toasts]);
    setTimeout(() => {
      removeToast(id);
    }, timeout);
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
        <Toast key={toast.id} message={toast.message} type={toast.type} action={toast.action} />
      ))}
    </div>
  );
};

export default ToastManager;
