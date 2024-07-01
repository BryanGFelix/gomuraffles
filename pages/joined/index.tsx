import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import style from '@/components/Raffles/raffles.module.css';
import Pagination from '@/components/Pagination';
import axiosInstance from '@/utils/axios';
import { PurchaseControlsProvider } from '@/hooks/purchaseControlsContext';
import JoinedRaffleCard from '@/components/RaffleCards/joinedRaffleCard';
import { RaffleData } from '@/hooks/raffleContext';

const ParticipatingRafflesPage = () => {
    const account = useAccount();
    const [raffles, setRaffles] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false); 

    useEffect(() => {
        if(account.address && !hasFetched) {
            setHasFetched(true);
            fetchRaffles(page);
        }
    }, [account.address]);

    const fetchRaffles = (page: number) => {
        setLoading(true);
        axiosInstance.post('/getJoinedRaffles', {
            user: account.address,
            page,
        }).then((response) => {
            setLoading(false);
            if (response.data) {
                setRaffles(response.data.data);
                setTotalPages(response.data.totalPages);
            }
        }).catch((err) => {
            setLoading(false);
            console.error('Failed to fetch participating raffles:', err);
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchRaffles(newPage);
    };

    return (
        <div className={style.pageContainer}>
            <h1 className={style.pageTitle}>Joined Raffles</h1>
            {!loading && (
                <>
                    {raffles.length > 0 &&
                        <>
                            <div className={style.RaffleItems}>
                                {raffles.map((raffle: RaffleData) => (
                                    <PurchaseControlsProvider numTicketsHeld={Number(raffle.userTickets)}>
                                        <JoinedRaffleCard raffleData={raffle}/>
                                    </PurchaseControlsProvider>
                                ))}
                                
                            </div>
                            <Pagination 
                                currentPage={page} 
                                totalPages={totalPages} 
                                onPageChange={handlePageChange} 
                            />
                        </>
                    }
                    {raffles.length === 0 && <p className={style.infoText}>You haven't joined any raffles!</p>}
                </>
            )}
            {loading && <p className={style.infoText}>Fetching Raffles...</p>}
        </div>
    );
}

export default ParticipatingRafflesPage;
