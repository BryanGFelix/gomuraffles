export const formatTimeLeft = (timeStarted: number, duration: number) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const endTime = timeStarted + duration;
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
        return "Time is up!";
    }

    const minutes = Math.floor(timeLeft / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "< 1 minute left";
    else if (minutes < 5) return "< 5 minutes left";
    else if (minutes < 15) return "< 15 minutes left";
    else if (minutes < 30) return "< 30 minutes left";
    else if (hours < 1) return "< 1 hour left";
    else if (hours < 12) return `< ${Math.ceil(hours)} hours`; // Rounds up to the next hour
    else if (days < 1) return "< 1 day left";
    else return "> 1 day left";
}

export const hasRaffleEnded = (timeStarted: number, duration: number) => {
    const timeToEnd = Number(timeStarted) + Number(duration);
    return Date.now() / 1000 > timeToEnd;
}