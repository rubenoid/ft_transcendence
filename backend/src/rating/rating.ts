export class newRating {

    /* scoreDifference is always a positive number */
    kFactor(scoreDifference: number): number {
        return (10 + scoreDifference);
    }

    /* returns a value between 0 and 1 */
    expectedWin(playerRating: number, opponentRating: number): number {
        return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    }

    newRating(playerRating: number, opponentRating: number, scorePlayer: number, scoreOpponent: number): number {
        const K = this.kFactor(Math.abs(scorePlayer - scoreOpponent));
        const E = this.expectedWin(playerRating, opponentRating);
        const won = scorePlayer > scoreOpponent ? 1 : 0;
        return playerRating + (K * (won - E));
    }

}