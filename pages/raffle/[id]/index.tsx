import { useAccount } from 'wagmi';
import React from 'react';
import { useRouter } from 'next/router';
import { RaffleProvider } from '@/hooks/raffleContext';
import RafflePage from '@/components/Raffles/rafflePage';

const RafflePageContainer = () => {
    const router = useRouter();
    const id = router.query.id;

    const account = useAccount(); 

    return (
        <RaffleProvider raffleID={id} address={account.address}>
            <RafflePage/>
        </RaffleProvider>
    )
}

export default RafflePageContainer;