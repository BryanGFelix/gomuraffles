import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import Button from "../Button/Button";
import { contract } from "@/utils/contract";
import RaffleAbi from '../../abis/Raffle.json';
import styles from './raffleCard.module.css';
import { ethers } from "ethers";
import { usePurchaseControlsContext } from "@/hooks/purchaseControlsContext";
import axiosInstance from "@/utils/axios";
import {
    useConnectModal,
  } from '@rainbow-me/rainbowkit';

const PurchaseTicketsControls = ({limit, ticketPrice, raffleID}) => {
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
            const ticketsValue = ethers.parseEther((Number(ticketPrice) * numTicketsToPurchase).toString());
            writeContractAsync({
                address: process.env.CONTRACT_ADDRESS as `0x${string}`,
                abi: RaffleAbi,
                functionName: 'purchaseTicket',
                args: [raffleID, numTicketsToPurchase],
                value: ticketsValue
            }).finally(() => {
                setIsPurchasing(false);
            })

            setTimeout(() => {
                setIsPurchasing(false);                      
            }, 15000);
        }
    }

    const handleIncrement = () => {
        const newTickets = numTicketsToPurchase + 1;
        if (limit > 0 && (limit < newTickets || limit - numTicketsHeldContext < newTickets)) return;
        setNumTicketsToPurchase(newTickets);
    }

    const handleDecrement = () => {
        if(Number(numTicketsToPurchase) > 1) {
            setNumTicketsToPurchase(numTicketsToPurchase - 1);
        }
    }

    const handleChange = (event) => {
        const value = event.target.value;
        // Check if the string is empty or only digits
        if (value === '' || /^\d+$/.test(value)) {
            setNumTicketsToPurchase(value === '' ? '' : parseInt(value, 10));
        }
    };

    const handleBlur = () => {
        if (numTicketsToPurchase === '' || numTicketsToPurchase === 0) {
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