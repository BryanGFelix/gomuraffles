import styles from './raffleCard.module.css';
import PurchaseTicketsControls from './purchaseTicketsControls';
import { usePurchaseControlsContext } from '@/hooks/purchaseControlsContext';
import { hasRaffleEnded } from '@/utils/utils';

type MinimalCardProps = {
    limit: number;
    ticketPrice: string;
    raffleID: number;
    isActive: boolean;
    timeStarted: number;
    duration: number;
    hasWon: boolean;
}

const MinimalCard = ({limit, ticketPrice, raffleID, isActive, timeStarted, duration, hasWon}: MinimalCardProps) => {

    const { numTicketsHeldContext } = usePurchaseControlsContext();
    const raffleHasEnded = hasRaffleEnded(timeStarted, duration);
    const hasLimit = limit > 0;

    const getTicketsHeld = () => {
        console.log(numTicketsHeldContext);
        const ticketsHeld = hasLimit ? `${numTicketsHeldContext} / ${limit}` : numTicketsHeldContext;
        return (
            <>
                <p>Tickets Held:</p>
                <p>{ticketsHeld}</p>
            </>
        )
    }

    const getMinimalContent = () => {
        if (!isActive) {
            return (
                <p>{hasWon ? 'YOU WON' : 'YOU LOST'}</p>
            );
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
            <div className={`${styles.raffleCard} ${raffleHasEnded ? styles.raffleCardMinimalEnded : ''}`}>
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