import { useAccount } from 'wagmi';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './raffle.module.css';
import Link from 'next/link';
import MinimalCard from '@/components/RaffleCards/minimalCard';
import { PurchaseControlsProvider } from '@/hooks/purchaseControlsContext';
import axiosInstance from '@/utils/axios';
import TimeLeft from '@/components/TimeLeft';

const RafflePage = () => {
    const account = useAccount();
    const [raffleData, setRaffleData] = useState(null);
    const [fetchingRaffle, setFetchingRaffle] = useState(true);
    const router = useRouter();
    const id = router.query.id;

    const handleCopyFrameLink = () => {
        window.addToast('Copied Link', 'info');
    }

    useEffect(() => {
        if (id && account) {
            axiosInstance.post('/getRaffle', {
                id: Number(id),
                user: account.address
            }).then((response) => {
                setFetchingRaffle(false);
                if(response.data) {
                    setRaffleData(response.data);
                }
            }).catch((err) => {
                setFetchingRaffle(false);
            });
        }

        setTimeout(() => {
            setFetchingRaffle(false);
        }, 10000)
    }, [id]);  

    const raffleOwnerBaseScanLink = raffleData && `https://basescan.org/address/${raffleData.owner}`;
    const totalTickets = raffleData && raffleData.maxTotalTickets > 0 ? raffleData.maxTotalTickets : 'Unlimited';
    const ticketsPerParticipant = raffleData && raffleData.maxEntries > 0 ? raffleData.maxEntries : 'Unlimited';
    const ticketPriceText = raffleData && Number(raffleData.ticketPrice) > 0 ? `${raffleData.ticketPrice} ETH` : 'FREE';

    return (
            <div className={styles.content}>
                {fetchingRaffle && <p className={styles.loadingText}>Fetching Raffle Data...</p>}
                {!fetchingRaffle && !raffleData && <p className={styles.loadingText}>Could not retrieve Raffle data</p>}
                {raffleData && 
                    <PurchaseControlsProvider numTicketsHeld={raffleData.userTickets}>
                        <div className={styles.rafflePageContainer}>
                            <div className={styles.header}>
                                <h2 className={styles.title}>{raffleData.title} (ID: {raffleData.id})</h2>
                                <TimeLeft timeStarted={raffleData.timeStarted} duration={raffleData.duration}/>
                            </div>
                            <div className={styles.rafflePageSubContainer}>
                                <MinimalCard 
                                    limit={raffleData.maxEntries}
                                    ticketPrice={raffleData.ticketPrice}
                                    raffleID={raffleData.id}
                                    isActive={raffleData.isActive}
                                    timeStarted={Number(raffleData.timeStarted)}
                                    duration={raffleData.duration}
                                />
                                <div className={styles.raffleDetails}>
                                    {raffleData.allowDuplicates && <p className={styles.duplicates}>Allows Duplicates</p>}
                                    <h3 className={styles.sectionHeader}>Raffle Details</h3>
                                    <div className={styles.miniSection}>
                                        <h4 className={styles.sectionSubHeader}>Owned By</h4>
                                        <Link href={raffleOwnerBaseScanLink}>{raffleData.owner.substring(0, 30)}...</Link>
                                    </div>
                                    <div className={styles.miniSection}>
                                        <h4 className={styles.sectionSubHeader}>Number of Winners</h4>
                                        <p>{raffleData.numWinners}</p>
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
                                            <p>{raffleData.totalTickets} / {totalTickets}</p>
                                        </div>
                                    </div>
                                    <button className={styles.frameLink} onClick={handleCopyFrameLink}>Copy Frames Link</button>
                                </div>
                            </div>
                        </div>
                    </PurchaseControlsProvider>
                }
            </div>
    )
}

export default RafflePage;