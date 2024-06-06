'use client';

import { useEffect, useState } from 'react';
import RaffleCard from '@/components/RaffleCards/ownedRaffleCard';
import style from './raffles.module.css';
import axiosInstance from '@/utils/axios';

type OwnedRafflesPropType = {
    address: `0x${string}` | undefined,
}

const OwnedRaffles = ({address}: OwnedRafflesPropType) => {
    const [raffles, setRaffles] = useState([]);
    const [fetchingRaffles, setFetchingRaffles] = useState(true);

    useEffect(() => {
        if(address) {
            axiosInstance.post('/getOwnedRaffles', {
                owner: address
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
    }, []);

    return (
        <>
            {fetchingRaffles && <p className={style.infoText}>Fetching Raffles...</p>}
            {!fetchingRaffles && (
                <div className={style.RaffleItems}>
                    {raffles.length > 0 &&
                        (
                            raffles.map((raffle) => {
                                return <RaffleCard raffleData={raffle}/>
                            })
                        )
                    }
                    {raffles.length === 0 && <p className={style.infoText}>You haven't created any raffles!</p>}
                </div>
            )}
        </>
    )
}

export default OwnedRaffles;