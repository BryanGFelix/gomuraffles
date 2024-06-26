import Button from '../Button/Button';
import styles from './raffleCard.module.css';
import Link from 'next/link';
import TimeLeft from '../TimeLeft';
import RaffleStatus from '../Raffles/raffleStatus';
import { RaffleData } from '@/hooks/raffleContext';
import Big from 'big.js';

const RaffleCard = ({raffleData} : {raffleData: RaffleData}) => {
    const { totalTickets, ticketPrice, timeStarted, duration, isActive, id, title, wasCancelled } = raffleData;

    const totalTicketPrice = (Big(ticketPrice).times(totalTickets).toString());

    const getBaseRaffleCardData = () => (
        <Link href={`/raffle/${id}`} className={styles.raffleLink}>
            <div className={`${styles.raffleCard} ${styles.raffleCardLink}`}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.raffleSection}>
                    <h3 className={styles.sectionTitle}>ID:</h3>
                    <p className={styles.raffleID}>{id}</p>
                </div>
                <div className={styles.raffleSection}>
                    <h3 className={styles.sectionTitle}>Ticket Price:</h3>
                    <p>{ticketPrice} ETH</p>
                </div>
                <div className={styles.raffleSection}>
                    <h3 className={styles.sectionTitle}>Total Tickets Purchased</h3>
                    <p>{Number(totalTickets)}</p>
                </div>
                <div className={styles.raffleSection}>
                    <h3 className={styles.sectionTitle}>Amount Raised</h3>
                    <p>{totalTicketPrice} ETH</p>
                </div>
                <div className={styles.raffleTime}>
                    <TimeLeft timeStarted={timeStarted} duration={duration} wasCancelled={wasCancelled}/>
                    <RaffleStatus timeStarted={timeStarted} duration={duration} isActive={isActive}/>
                </div>
            </div>
        </Link>
    )

    const getButtonText = () => {
        if(!isActive) {
            return 'Completed';
        } else if (wasCancelled) {
            return 'Cancelled';
        } else {
            return 'In Progress...'
        }
    }

    return (
        <div className={styles.raffleCardContainer}>
            {getBaseRaffleCardData()}
            <Button disabled={true}>
                {getButtonText()}
            </Button>
        </div>
    )
}

export default RaffleCard;