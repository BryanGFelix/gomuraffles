'use client';

import { useEffect, useState } from 'react';
import style from './raffles.module.css';
import JoinedRaffleCard from '../RaffleCards/joinedRaffleCard';
import axiosInstance from '@/utils/axios';
import { PurchaseControlsProvider } from '@/hooks/purchaseControlsContext';

type ParticipatingRafflesPropType = {
    address: `0x${string}` | undefined,
}

const ParticipatingRaffles = ({address}: ParticipatingRafflesPropType) => {
    const [raffles, setRaffles] = useState([]);
    const [fetchingRaffles, setFetchingRaffles] = useState(true);

    useEffect(() => {
        if(address) {
            axiosInstance.post('/getJoinedRaffles', {
                user: address
            }).then((response) => {
                setFetchingRaffles(false);
                if (response.data) {
                    setRaffles(response.data)
                }  
            }).catch((err) => {
                setFetchingRaffles(false);   
            });
        }
        setTimeout(() => {
            setFetchingRaffles(false);                      
        }, 15000)
    }, [address]);

    return (
        <>
            {fetchingRaffles && <p className={style.infoText}>Fetching Raffles...</p>}
            {!fetchingRaffles && (
                <div className={style.RaffleItems}>
                    {raffles.length > 0 &&
                        (
                            raffles.map((raffle) => {
                                return (
                                    <PurchaseControlsProvider numTicketsHeld={Number(raffle.userTickets)}>
                                        <JoinedRaffleCard raffleData={raffle}/>
                                    </PurchaseControlsProvider>
                                );
                            })
                        )
                    }
                    {raffles.length === 0 && <p className={style.infoText}>You haven't joined any raffles!</p>}
                </div>
            )}
        </>
    )
}

export default ParticipatingRaffles;