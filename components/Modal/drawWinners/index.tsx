import Button from "@/components/Button/Button";
import Modal from "../modal"
import styles from './index.module.css';
import { useRaffleContext } from "@/hooks/raffleContext";

type DrawingWinnersModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    chooseWinners: () => void;
}

const DrawingWinnersModal = ({isOpen, closeModal, chooseWinners}: DrawingWinnersModalProps) => {
    const {raffleData} = useRaffleContext();
    const {title} = raffleData;
    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <p className={styles.modalText}>Are you sure you want to draw the winners for your raffle?</p>
            <p className={styles.modalTitle}>{title}</p>
            <div className={styles.modalButtons}>
                <Button onClick={chooseWinners} className='drawWinnersModalButton'>Confirm</Button>
                <Button onClick={closeModal} className='drawWinnersModalButton'>Close</Button>
            </div>
        </Modal>
    )
}

export default DrawingWinnersModal;