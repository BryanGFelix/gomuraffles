import styles from './raffleCard.module.css';
import PurchaseTicketsControls from './purchaseTicketsControls';
import { usePurchaseControlsContext } from '@/hooks/purchaseControlsContext';
import { hasRaffleEnded } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { downloadExcel } from './utils';
import axiosInstance from '@/utils/axios';
import Button from '../Button/Button';
import { useAccount, useWriteContract } from 'wagmi';
import RaffleAbi from '@/abis/Raffle.json';
import { logTransaction, updateTransactionStatus, waitForTransactionReceipt } from '@/utils/transactions';

type MinimalCardProps = {
    limit: number;
    ticketPrice: string;
    raffleID: string;
    isActive: boolean;
    timeStarted: number;
    duration: number;
    wasCancelled: boolean;
    refunded: boolean;
    numTicketsHeld: number;
}

type Winner = {
    address: string;
}

const MinimalCard = ({limit, ticketPrice, raffleID, isActive, timeStarted, duration, wasCancelled, refunded, numTicketsHeld}: MinimalCardProps) => {
    const account = useAccount();

    const { writeContractAsync } = useWriteContract();
    
    const raffleHasEnded = hasRaffleEnded(timeStarted, duration);

    const [winners, setWinners] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [refunding, setRefunding] = useState(false);
    
    const eligibleForRefund = !refunded && wasCancelled && numTicketsHeld > 0 && Number(ticketPrice) !== 0;
    
    useEffect(() => {
        viewWinners();
    }, []);

    const viewWinners = () => {
        if(!isActive && !wasCancelled) {
            setFetching(true);
            axiosInstance.post('/getWinners', {
                id: raffleID,
            }).then((response) => {
                setFetching(false);
                if(response.data) {
                    setWinners(response.data);
                }
            }).catch(() => {
                setFetching(false);
            });
        }
    }

    const refund = async() => {
        if (eligibleForRefund && !refunding) {
            setRefunding(true);
            try {
                const hash = await writeContractAsync({
                    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
                    abi: RaffleAbi,
                    functionName: 'collectRefund',
                    args: [raffleID]
                });

                await logTransaction(hash, 'collect_refund', String(account.address), raffleID);

                const status = await waitForTransactionReceipt(hash, 2);
                if (status === 1) {
                    window.addToast(`Tickets Refunded!`, 'success');
                } else {
                    window.addToast(`Failed to process refund`, 'error');
                    await updateTransactionStatus(hash, 'failed');
                }
            } catch (err) {
                window.addToast(`Failed to process refund`, 'error');
            } finally {
                setRefunding(false);       
            }
        }
    }

    const { numTicketsHeldContext } = usePurchaseControlsContext();
    const hasLimit = limit > 0;

    const getTicketsHeld = () => {
        const ticketsHeld = hasLimit ? `${numTicketsHeldContext} / ${limit}` : numTicketsHeldContext;
        return (
            <>
                <p>Tickets Held:</p>
                <p>{ticketsHeld}</p>
            </>
        )
    }

    const getMinimalContent = () => {
        if(fetching) {
            return <p className={styles.drawing}>Fetching Winners...</p>
        } else if(!isActive && !wasCancelled) {
            return <>
                <h2 className={styles.title}>Winners ({winners.length})</h2>
                <div className={styles.winnerList}>
                    {winners.slice(0, 10).map((winner: Winner, index) => (
                        <p className={styles.address}>{index + 1}. {winner.address}</p>
                    ))}
                    {winners.length > 10  && <p>...</p>}
                </div>
                <p className={styles.download} onClick={() => {downloadExcel}}>Download Spreadsheet</p>
            </>
        } else if (wasCancelled) {
            return <p className={styles.drawing}>Cancelled</p>;
        } else if (wasCancelled && refunded) {
            return <p className={styles.drawing}>Refunded</p>; 
        } else if (isActive && raffleHasEnded) {
            return (
                <>
                    <p className={styles.drawing}>Drawing Winners...</p>
                    {getTicketsHeld()}
                </>
            );
        } else {
            return getTicketsHeld();
        }
    }

    return (
        <div className={styles.raffleCardContainer}>
            <div className={`${styles.raffleCard} ${raffleHasEnded || !eligibleForRefund ? styles.raffleHasEnded : ''}`}>
                <div className={styles.minimalContent}>
                    {getMinimalContent()}
                </div>
            </div>
            {!raffleHasEnded && isActive ?
            <PurchaseTicketsControls
                    limit={limit}
                    ticketPrice={ticketPrice}
                    raffleID={raffleID}
                />
                : 
                null
            }
            {eligibleForRefund ?
                <Button onClick={refund} disabled={refunding}>
                    {refunding ? 'Refunding...' : 'Collect Refund'}
                </Button>
                :
                null
            }
        </div>
    )
}

export default MinimalCard;