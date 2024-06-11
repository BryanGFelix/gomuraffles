import { useRaffleContext } from "@/hooks/raffleContext";
import styles from './rafflePage.module.css';
import { PurchaseControlsProvider } from "@/hooks/purchaseControlsContext";
import TimeLeft from "../TimeLeft";
import MinimalCard from "../RaffleCards/minimalCard";
import Link from "next/link";
import OwnerControls from "../OwnerControls/ownerControls";
import { useAccount } from "wagmi";

const RafflePage = () => {
    const {raffleData, fetchingRaffle} = useRaffleContext();
    const account = useAccount();

    const {
        owner,
        maxTotalTickets,
        maxEntries,
        ticketPrice,
        id,
        duration,
        title,
        userTickets,
        timeStarted,
        isActive,
        numWinners,
        allowDuplicates
    } = raffleData;

    console.log(raffleData);

    const handleCopyFrameLink = () => {
        window.addToast('Copied Link', 'info');
    }

    const raffleOwnerBaseScanLink = `https://basescan.org/address/${owner}`;
    const totalTickets =  maxTotalTickets > 0 ? maxTotalTickets : 'Unlimited';
    const ticketsPerParticipant = maxEntries > 0 ? maxEntries : 'Unlimited';
    const ticketPriceText =  Number(ticketPrice) > 0 ? `${ticketPrice} ETH` : 'FREE';

    return (
        <div className={styles.content}>
                {fetchingRaffle && <p className={styles.loadingText}>Fetching Raffle Data...</p>}
                {!fetchingRaffle && !raffleData && <p className={styles.loadingText}>Could not retrieve Raffle data</p>}
                {id &&
                    <div>
                        {owner === account.address &&  <OwnerControls/>}
                        <PurchaseControlsProvider numTicketsHeld={userTickets}>
                            <div className={styles.rafflePageContainer}>
                                <div className={styles.header}>
                                    <h2 className={styles.title}>{title} (ID: {id})</h2>
                                    <TimeLeft timeStarted={timeStarted} duration={duration}/>
                                </div>
                                <div className={styles.rafflePageSubContainer}>
                                    <MinimalCard 
                                        limit={maxEntries}
                                        ticketPrice={ticketPrice}
                                        raffleID={id}
                                        isActive={isActive}
                                        timeStarted={timeStarted}
                                        duration={duration}
                                    />
                                    <div className={styles.raffleDetails}>
                                        {allowDuplicates && <p className={styles.duplicates}>Allows Duplicates</p>}
                                        <h3 className={styles.sectionHeader}>Raffle Details</h3>
                                        <div className={styles.miniSection}>
                                            <h4 className={styles.sectionSubHeader}>Owned By</h4>
                                            <Link href={raffleOwnerBaseScanLink}>{owner.substring(0, 30)}...</Link>
                                        </div>
                                        <div className={styles.miniSection}>
                                            <h4 className={styles.sectionSubHeader}>Number of Winners</h4>
                                            <p>{numWinners}</p>
                                        </div>
                                        <div>
                                            <div className={styles.miniSection}>
                                                <h4 className={styles.sectionSubHeader}>Entry Price</h4>
                                                <p>{ticketPriceText}</p>
                                            </div>
                                            <div className={styles.miniSection}>
                                                <h4 className={styles.sectionSubHeader}>Entry Limit Per Participant</h4>
                                                <p>{ticketsPerParticipant}</p>
                                            </div>
                                            <div className={styles.miniSection}>
                                                <h4 className={styles.sectionSubHeader}>Total Tickets</h4>
                                                <p>{totalTickets}</p>
                                            </div>
                                            <div className={styles.miniSection}>
                                                <h4 className={styles.sectionSubHeader}>Number of Tickets Sold</h4>
                                                <p>{totalTickets} / {totalTickets}</p>
                                            </div>
                                        </div>
                                        <button className={styles.frameLink} onClick={handleCopyFrameLink}>Copy Frames Link</button>
                                    </div>
                                </div>
                            </div>
                        </PurchaseControlsProvider>
                    </div>
                }
        </div>
    )
}

export default RafflePage;