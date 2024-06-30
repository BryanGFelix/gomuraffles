import styles from './raffleCard.module.css';
import PurchaseTicketsControls from './purchaseTicketsControls';
import { usePurchaseControlsContext } from '@/hooks/purchaseControlsContext';
import { hasRaffleEnded } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { downloadExcel } from './utils';
import axiosInstance from '@/utils/axios';

type MinimalCardProps = {
    limit: number;
    ticketPrice: string;
    raffleID: string;
    isActive: boolean;
    timeStarted: number;
    duration: number;
    wasCancelled: boolean;
}

const MinimalCard = ({limit, ticketPrice, raffleID, isActive, timeStarted, duration, wasCancelled}: MinimalCardProps) => {
    const raffleHasEnded = hasRaffleEnded(timeStarted, duration);

    const [winners, setWinners] = useState([]);
    const [fetching, setFetching] = useState(false);
    
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
                    {winners.slice(0, 10).map((winner, index) => (
                        <p className={styles.address}>{index + 1}. {winner}</p>
                    ))}
                    {winners.length > 10  && <p>...</p>}
                </div>
                <p className={styles.download} onClick={downloadExcel}>Download Spreadsheet</p>
            </>
        } else if (wasCancelled) {
            return <p className={styles.drawing}>Cancelled</p>;
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
            <div className={`${styles.raffleCard} ${raffleHasEnded ? styles.raffleHasEnded : ''}`}>
                <div className={styles.minimalContent}>
                    {getMinimalContent()}
                </div>
            </div>
            {!raffleHasEnded && 
                <PurchaseTicketsControls
                    limit={limit}
                    ticketPrice={ticketPrice}
                    raffleID={raffleID}
                />
            }
        </div>
    )
}

export default MinimalCard;