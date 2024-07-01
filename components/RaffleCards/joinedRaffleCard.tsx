import { ethers } from 'ethers';
import styles from './raffleCard.module.css';
import Link from 'next/link';
import PurchaseTicketsControls from './purchaseTicketsControls';
import { usePurchaseControlsContext } from '@/hooks/purchaseControlsContext';
import TimeLeft from '../TimeLeft';
import RaffleStatus from '../Raffles/raffleStatus';

const JoinedRaffleCard = ({raffleData}) => {
    const { totalTickets, ticketPrice, timeStarted, duration, isActive, id, title, maxEntries, hasWon, maxTickets, numTicketsOwned, wasCancelled } = raffleData;
    const { numTicketsHeldContext } = usePurchaseControlsContext();

    const totalTicketsAvailable = maxTickets > 0  ? maxTickets - totalTickets : 'Unlimited';
    const ticketPriceText = Number(ticketPrice) > 0 ? `${ethers.formatEther(ticketPrice)} ETH` : 'FREE';

    return (
        <div className={styles.raffleCardContainer}>
            <Link href={`/raffle/${id}`} className={styles.raffleLink}>
                <div className={`${styles.raffleCard} ${styles.raffleCardLink}`}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.raffleSection}>
                        <h3 className={styles.sectionTitle}>Raffle ID:</h3>
                        <p>{Number(id)}</p>
                    </div>
                    <div className={styles.raffleSection}>
                        <h3 className={styles.sectionTitle}>Ticket Price:</h3>
                        <p>{ticketPriceText}</p>
                    </div>
                    <div className={styles.raffleSection}>
                        <h3 className={styles.sectionTitle}>My Tickets</h3>
                        <p>{Number(numTicketsHeldContext)} {maxEntries > 0 && `/ ${maxEntries}`}</p>
                    </div>
                    <div className={styles.raffleSection}>
                        <h3 className={styles.sectionTitle}>Total Tickets Available</h3>
                        <p>{totalTicketsAvailable}</p>
                    </div>
                    <div className={styles.raffleTime}>
                        <TimeLeft timeStarted={timeStarted} duration={duration} wasCancelled={wasCancelled}/>
                        <RaffleStatus timeStarted={timeStarted} duration={duration} isActive={isActive}/>
                    </div>
                </div>
            </Link>
            <PurchaseTicketsControls limit={maxEntries} ticketPrice={ticketPrice} raffleID={id}/>
        </div>
    )
}

export default JoinedRaffleCard;