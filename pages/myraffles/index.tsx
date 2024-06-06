'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import style from './raffles.module.css';
import OwnedRaffles from '../../components/Raffles/ownedRaffles';
import ParticipatingRaffles from '../../components/Raffles/participatingRaffles';

const MyRaffles = () => {

    const account = useAccount();
    const [showOwnedRaffles, setShowOwnedRaffles] = useState(false);

    const changeTab = () => {
        setShowOwnedRaffles(!showOwnedRaffles);
    }

    return (
        <div>
            <div className={style.tabsButtonContainer}>
                <button onClick={changeTab} className={`${style.tabButton} ${showOwnedRaffles && style.activeTab}`}>Owned Raffles</button>
                <button onClick={changeTab} className={`${style.tabButton} ${!showOwnedRaffles && style.activeTab}`}>Joined Raffles</button>
            </div>
            <div className={style.RaffleItems}>
                {showOwnedRaffles ? 
                    <OwnedRaffles address={account.address}/>
                    :
                    <ParticipatingRaffles address={account.address}/>
                }   
            </div>
        </div>
    )
}

export default MyRaffles;