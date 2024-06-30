// components/Toast.tsx
import React from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Toast: React.FC<ToastProps> = ({ message, type, action }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span>{message}</span>
      {action && (
        <button onClick={action.onClick} className={styles.actionButton}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default Toast;
