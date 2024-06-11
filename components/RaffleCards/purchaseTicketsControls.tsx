import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import Button from "../Button/Button";
import RaffleAbi from '../../abis/Raffle.json';
import styles from './raffleCard.module.css';
import { ethers } from "ethers";
import { usePurchaseControlsContext } from "@/hooks/purchaseControlsContext";
import {
    useConnectModal,
  } from '@rainbow-me/rainbowkit';
import Big from 'big.js';
import { contract } from "@/utils/contract";

type PurchaseTicketsControlsProps = {
    limit: number;
    ticketPrice: string;
    raffleID: number;
}

const PurchaseTicketsControls = ({limit, ticketPrice, raffleID}: PurchaseTicketsControlsProps) => {
    const account = useAccount();
    const { openConnectModal } = useConnectModal();
    const { data: hash, writeContractAsync } = useWriteContract();
    const { numTicketsHeldContext, setNumTicketsHeldContext } = usePurchaseControlsContext();

    const [numTicketsToPurchase, setNumTicketsToPurchase] = useState(1);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const disablePurchase = (numTicketsHeldContext >= limit && limit > 0) || isPurchasing;
    

    const buyTickets = async() => {
        if (!account.address) {
            if(openConnectModal) {
                openConnectModal();
            }  
        } else {
            if (disablePurchase) return;
            setIsPurchasing(true);

            try {
                const ticketsValue = ethers.parseEther((Big(ticketPrice).times(numTicketsToPurchase).toString()));
                writeContractAsync({
                    address: process.env.CONTRACT_ADDRESS as `0x${string}`,
                    abi: RaffleAbi,
                    functionName: 'purchaseTicket',
                    args: [raffleID, numTicketsToPurchase],
                    value: ticketsValue
                }).finally(() => {
                    setIsPurchasing(false);
                }).catch((err) => {
                    console.log(err)
                })

                contract.on('PurchasedRaffleTickets', async (id, address, numEntries, totalTickets, participantTickets) => {
                    if (Number(id) === raffleID) {
                        setNumTicketsHeldContext(participantTickets);
                        contract.off('PurchasedRaffleTickets')
                    }
                });
            } catch (err) {
                console.log(err);
                setIsPurchasing(false);
            }
           

            setTimeout(() => {
                setIsPurchasing(false);                      
            }, 10000);
        }
    }

    const handleIncrement = () => {
        const newTickets = numTicketsToPurchase + 1;
        console.log('LIMIT', limit);
        console.log('NEW TICKETS', newTickets);
        console.log('TICKTS HELD', numTicketsHeldContext);
        if (limit > 0 && (limit < newTickets || limit - numTicketsHeldContext < newTickets)) return;
        setNumTicketsToPurchase(newTickets);
    }

    const handleDecrement = () => {
        if(Number(numTicketsToPurchase) > 1) {
            setNumTicketsToPurchase(numTicketsToPurchase - 1);
        }
    }

    const handleChange = (event: { target: { value: any; }; }) => {
        const value = event.target.value;
        // Check if the string is empty or only digits
        if (value === '' || /^\d+$/.test(value)) {
            setNumTicketsToPurchase(value === '' ? 0 : parseInt(value, 10));
        }
    };

    const handleBlur = () => {
        if (Number(numTicketsToPurchase) === 0) {
            setNumTicketsToPurchase(1);  // Reset to 1 if the field is empty or 0
        }
    };

    const getButtonText = () => {
        if (isPurchasing) {
            return 'Buying Tickets...';
        } else if (numTicketsHeldContext >= limit && limit > 0) {
            return 'Limit Reached';
        } else {
            return 'Buy Tickets';
        }
    }

    return (
        <div>
            <div className={styles.numTicketController}>
                <button className={styles.decrementButton} onClick={handleDecrement}>
                    -
                </button>
                <input type="text" value={numTicketsToPurchase} className={styles.numTicketInput} onChange={handleChange} onBlur={handleBlur}/>
                <button className={styles.incrementButton} onClick={handleIncrement}>
                    +
                </button>
            </div>
            <Button onClick={buyTickets} disabled={disablePurchase}>
                {getButtonText()}
            </Button>
        </div>
    )

}

export default PurchaseTicketsControls;