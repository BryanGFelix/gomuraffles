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

    const getRaffleStatus = () => {
        if (!isActive) {
            return 'Ended';
        } else if (raffleHasEnded && isActive) {
            return 'Drawing';
        } else {
            return 'Running';
        }
    }
    
    return (
        <div>
            {getRaffleStatus()}
        </div>
    );
}

export default RaffleStatus;