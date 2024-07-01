interface Window {
    addToast: (message: string, type: 'info' | 'success' | 'error' | 'warning', timeout?: number, action?: { label: string; onClick: () => void }) => void;
  }
  