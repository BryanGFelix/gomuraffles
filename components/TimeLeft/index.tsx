import styles from './index.module.css';
import {formatTimeLeft, hasRaffleEnded} from '@/utils/utils';

interface TimeLeftProps {
    timeStarted: number,
    duration: number,
    wasCancelled: boolean
}

const TimeLeft = ({timeStarted, duration, wasCancelled}: TimeLeftProps) => {

    const getClassName = () => {
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const endTime = timeStarted + duration;
        const timeLeft = endTime - now;

        const minutes = Math.floor(timeLeft / 60);
        const hours = Math.floor(minutes / 60);

        if (hours < 1 || wasCancelled) return styles.redBackground;
        if (hours < 12) return styles.yellowBackground;
        return styles.greenBackground;
    }

    const getContent = () => {
        if (wasCancelled) {
            return 'Cancelled'
        } else {
            return formatTimeLeft(timeStarted, duration);
        }
    }

    return (
        <p className={`${styles.timeLeft} ${getClassName()}`}>{getContent()}</p>
    );
}

export default TimeLeft;