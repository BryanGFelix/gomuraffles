import {useState} from 'react';
import Button from "@/components/Button/Button";
import Modal from "../modal"
import styles from './index.module.css';
import { useRaffleContext } from "@/hooks/raffleContext";
import RaffleAbi from '@/abis/Raffle.json';
import { useWriteContract, useAccount } from "wagmi";
import { logTransaction, updateTransactionStatus, waitForTransactionReceipt } from "@/utils/transactions";
import {
    useConnectModal,
  } from '@rainbow-me/rainbowkit';

type CancelRaffleModalProps = {
    isOpen: boolean;
    closeModal: () => void;
    cancelRaffle: () => void;
}

const CancelRaffleModal = ({isOpen, closeModal, cancelRaffle}: CancelRaffleModalProps) => {
    const account = useAccount();
    const {raffleData} = useRaffleContext();
    const { openConnectModal } = useConnectModal();
    const {title, id} = raffleData;

    const { writeContractAsync } = useWriteContract();
    
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelRaffle = async() => {
        setIsCancelling(true);
        if (!account.address) {
            if(openConnectModal) {
                openConnectModal();
            }
            setIsCancelling(false); 
        } else {
            try {
                const hash = await writeContractAsync({
                    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
                    abi: RaffleAbi,
                    functionName: 'cancelRaffle',
                    args: [id]
                });

                await logTransaction(hash, 'cancel_raffle', account.address, id);

                const status = await waitForTransactionReceipt(hash, 2);
                if (status === 1) {
                    closeModal();
                    window.addToast(`Raffle cancelled`, 'success');
                } else {
                    window.addToast(`Failed to cancel raffle`, 'error');
                    await updateTransactionStatus(hash, 'failed');
                }
            } catch (err) {
                window.addToast(`Failed to purchase tickets`, 'error');
            } finally {
                setIsCancelling(false);       
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            {isCancelling && <p> Attempting to cancel raffle...</p>}
            {!isCancelling &&
                <>
                    <p className={styles.modalText}>Are you sure you want to cancel your raffle?</p>
                    <p className={styles.modalTitle}>{title}</p>
                    <p className={styles.refundNotifcation}>Note: Raffle participants will be able initiate an automatic refund by visiting the raffle page and clicking 'Refund Tickets'</p>
                    <div className={styles.modalButtons}>
                        <Button onClick={handleCancelRaffle} disabled={isCancelling} className='modalButton'>Confirm</Button>
                        <Button onClick={closeModal} className='modalButton'>Close</Button>
                    </div>
                </> 
            }       
        </Modal>
    )
}

export default CancelRaffleModal;