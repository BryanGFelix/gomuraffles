import { useEffect, useState } from 'react';
import styles from './modal.module.css';
import { Pixelify_Sans } from 'next/font/google';
import ReactDOM from 'react-dom';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: any
}

const pixelify = Pixelify_Sans({ subsets: ['latin'], weight: '400', });

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    const [modalRoot, setModalRoot] = useState(null);

    useEffect(() => {
      let root = document.getElementById('modal-root');
      if (!root) {
        // Dynamically create the modal-root element if it doesn't exist
        root = document.createElement('div');
        root.id = 'modal-root';
        document.body.appendChild(root);
      }
      setModalRoot(root);
    }, []);
  
    if (!isOpen || !modalRoot) return null; // Ensure modalRoot is available
  
    return ReactDOM.createPortal(
      <div className={pixelify.className}>
        <div className={styles.container} onClick={onClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.content}>
              {children}
            </div>
          </div>
        </div>
      </div>,
      modalRoot
    );
  };

export default Modal;
