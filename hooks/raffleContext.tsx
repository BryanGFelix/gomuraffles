import axiosInstance from "@/utils/axios";
import { createContext, useContext, useEffect, useState } from "react";

type RaffleData = {
    id?: string,
    owner: string,
    title: string,
    description: string,
    ticketPrice: string,
    maxTotalTickets: number,
    maxEntries: number,
    numWinner: number,
    duration: number,
    timeStarted: number,
    timeEnded: number | null,
    allowDuplicates: boolean,
    isActive: boolean,
    wasCancelled: boolean,
    userTickets: number,
    totalTickets: number,
    numWinners: number,
    numWins: number,
}

interface RaffleContextInterface {
    raffleData: RaffleData,
    fetchingRaffle: boolean,
}

const RaffleContext = createContext<RaffleContextInterface | undefined>(undefined);

export const useRaffleContext = () => {
  const context = useContext(RaffleContext);
  if (context === undefined) {
    throw new Error("usePurchaseControlsContext must be used within a PurchaseControlsProvider");
  }
  return context;
};

interface RaffleProviderInterface {
    children: JSX.Element,
    raffleID: string,
    address: string | null
}

const defaultRaffleData: RaffleData = {
    id: undefined,
    owner: '',
    title: 'Loading...',
    description: 'Loading...',
    ticketPrice: '0',
    maxTotalTickets: 0,
    maxEntries: 0,
    numWinner: 0,
    duration: 0,
    timeStarted: 0,
    timeEnded: null,
    allowDuplicates: false,
    isActive: false,
    wasCancelled: false,
    userTickets: 0,
    totalTickets: 0,
    numWinners: 0,
    numWins: 0,
  };

export const RaffleProvider: React.FC = ({ children, raffleID, address }: RaffleProviderInterface) => {
  const [raffleData, setRaffleData] = useState(defaultRaffleData);
  const [fetchingRaffle, setFetchingRaffle] = useState(false);

  useEffect(() => {
    if (raffleID) {
        axiosInstance.post('/getRaffle', {
            id: raffleID,
            user: address
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
}, [raffleID, address]);  

  return (
    <RaffleContext.Provider value={{ raffleData, fetchingRaffle }}>
      {children}
    </RaffleContext.Provider>
  );
};

export default RaffleContext;