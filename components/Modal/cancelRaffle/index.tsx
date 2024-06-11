import Button from "@/components/Button/Button";
import Modal from "../modal"
import styles from './index.module.css';
import { useRaffleContext } from "@/hooks/raffleContext";

type CancelRaffleModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    cancelRaffle: () => void;
}

const CancelRaffleModal = ({isOpen, closeModal, cancelRaffle}: CancelRaffleModalProps) => {
    const {raffleData} = useRaffleContext();
    const {title} = raffleData;
    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <p className={styles.modalText}>Are you sure you want to cancel your raffle?</p>
            <p className={styles.modalTitle}>{title}</p>
            <p className={styles.refundNotifcation}>Note: Raffle participants will be able initiate an automatic refund by visiting the raffle page and clicking 'Refund Tickets'</p>
            <div className={styles.modalButtons}>
                <Button onClick={cancelRaffle} className='modalButton'>Confirm</Button>
                <Button onClick={closeModal} className='modalButton'>Close</Button>
            </div>
        </Modal>
    )
}

export default CancelRaffleModal;