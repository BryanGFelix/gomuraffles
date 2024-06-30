import { useState } from 'react';
import Button from '../Button/Button';
import styles from './ownerControls.module.css';
import CancelRaffleModal from '../Modal/cancelRaffle';

const OwnerControls = () => {
    const [isCancelRaffleModalOpen, setIsCancelRaffleModalOpen] = useState(false);

    const closeCancelRaffleModal = () => setIsCancelRaffleModalOpen(false);
    const openCancelRaffleModal = () => setIsCancelRaffleModalOpen(true);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>Raffle Owner Controls</h2>
                <div className={styles.buttons}>
                    <Button onClick={openCancelRaffleModal} className='ownerControls'>Cancel Raffle</Button>
                </div>
                <CancelRaffleModal isOpen={isCancelRaffleModalOpen} closeModal={closeCancelRaffleModal}/>
            </div>
        </div>
    );
}

export default OwnerControls;