import { hasRaffleEnded } from "@/utils/utils";

type RaffleStatusProps = {
    isActive: boolean;
    timeStarted: number;
    duration: number;
}

const RaffleStatus = (props: RaffleStatusProps) => {
    const {
        isActive,
        timeStarted,
        duration
    } = props;

    const raffleHasEnded = hasRaffleEnded(timeStarted, duration);
    
    return (
        <div>
            {!isActive && <p>Ended</p>}
            {raffleHasEnded && isActive && <p>Drawing</p>}
            {!raffleHasEnded && isActive && <p>Running</p>}
        </div>
    );
}

export default RaffleStatus;