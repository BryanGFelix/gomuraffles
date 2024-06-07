import Button from '../Button/Button';
import styles from './raffleCard.module.css';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { contract } from '@/utils/contract';
import Link from 'next/link';
import axiosInstance from '@/utils/axios';
import TimeLeft from '../TimeLeft';
import RaffleStatus from '../Raffles/raffleStatus';

type RaffleData = {
    totalTickets: number;
    ticketPrice: string;
    timeStarted: number;
    duration: number;
    isActive: boolean;
    id: number;
    title: string;
}

const RaffleCard = ({raffleData} : {raffleData: RaffleData}) => {
    const { totalTickets, ticketPrice, timeStarted, duration, isActive, id, title } = raffleData;
    const [drawingWinners, setDrawingWinners] = useState(false);
    const [isRaffleActive, setIsRaffleActive] = useState(isActive);
    const [raffleWinners, setRaffleWinners] = useState([]);
    const [viewingWinners, setViewingWinners] = useState(false);

    const chooseWinners = () => {
        setDrawingWinners(true);
        axiosInstance.post('/drawWinners', {
            id: Number(id),
          }).then((response) => {
            contract.on("WinnersSelected", (raffleID, winners, event) => {
                setIsRaffleActive(false);
                setRaffleWinners(winners);
                setViewingWinners(true);
                setDrawingWinners(false);
            });
          })
    }

    const viewWinners = () => {
        setViewingWinners(!viewingWinners);
    }

    const downloadExcel = () => {
        // Convert array of strings to an array of objects with a single property for each
        const formattedData = raffleWinners.map(address => ({ Address: address }));

        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Addresses");

        // Define a file name
        const fileName = "raffleData.xlsx";

        // Write the workbook to a file and trigger download
        XLSX.writeFile(workbook, fileName);
    };

    const getBaseRaffleCardData = () => (
        <Link href={`/raffle/${id}`} className={styles.raffleLink}>
            <div className={`${styles.raffleCard} ${styles.raffleCardLink}`}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.raffleSection}>
                    <h3 className={styles.sectionTitle}>Raffle ID:</h3>
                    <p>{id}</p>
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
                    <p>{Number(ticketPrice) * Number(totalTickets)} ETH</p>
                </div>
                <div className={styles.raffleTime}>
                    <TimeLeft timeStarted={timeStarted} duration={duration}/>
                    <RaffleStatus timeStarted={timeStarted} duration={duration} isActive={isActive}/>
                </div>
            </div>
        </Link>
    )

    const getViewWinnersRaffleCardData = () => {
        return (
            <div className={styles.raffleCard}>
                <h2 className={styles.title}>Winners ({raffleWinners.length})</h2>
                <div className={styles.winnerList}>
                    {raffleWinners.slice(0, 10).map((winner, index) => (
                        <p className={styles.address}>{index + 1}. {winner}</p>
                    ))}
                    {raffleWinners.length > 10  && <p>...</p>}
                </div>
                <p className={styles.download} onClick={downloadExcel}>Download Spreadsheet</p>
            </div>
        );
    }

    return (
        <div className={styles.raffleCardContainer}>
            {!viewingWinners && getBaseRaffleCardData()}
            {viewingWinners && getViewWinnersRaffleCardData()}
            {!isRaffleActive ?
                <Button onClick={viewWinners}>
                    {viewingWinners ? 'Back' : 'View Winners'}
                </Button>
                :
                <Button onClick={chooseWinners} disabled={drawingWinners}>
                    {drawingWinners ? 'Drawing...' : 'Draw Winners'}
                </Button>
            }
        </div>
    )
}

export default RaffleCard;