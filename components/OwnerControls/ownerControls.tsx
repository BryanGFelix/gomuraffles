import { useState } from 'react';
import Button from '../Button/Button';
import styles from './ownerControls.module.css';
import DrawingWinnersModal from '../Modal/drawWinners';
import CancelRaffleModal from '../Modal/cancelRaffle';

const OwnerControls = () => {
    const [isDrawWinnersModalOpen, setIsDrawWinnersModalOpen] = useState(false);
    const [isCancelRaffleModalOpen, setIsCancelRaffleModalOpen] = useState(false);

    const closeDrawWinnersModal = () => setIsDrawWinnersModalOpen(false);
    const openDrawWinnersModal = () => setIsDrawWinnersModalOpen(true);

    const closeCancelRaffleModal = () => setIsCancelRaffleModalOpen(false);
    const openCancelRaffleModal = () => setIsCancelRaffleModalOpen(true);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>Raffle Owner Controls</h2>
                <div className={styles.buttons}>
                    <Button onClick={openDrawWinnersModal} className='ownerControls'>Draw Winners</Button>
                    <Button onClick={openCancelRaffleModal} className='ownerControls'>Cancel Raffle</Button>
                </div>
                <DrawingWinnersModal isOpen={isDrawWinnersModalOpen} closeModal={closeDrawWinnersModal}/>
                <CancelRaffleModal isOpen={isCancelRaffleModalOpen} closeModal={closeCancelRaffleModal}/>
            </div>
        </div>
    );
}

export default OwnerControls;