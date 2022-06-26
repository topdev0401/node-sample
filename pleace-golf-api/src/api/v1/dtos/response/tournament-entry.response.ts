
/**
 * @swagger
 * definitions:
 *  TournamentEntryResponse:
 *      type: object
 *      properties:
 *          tournamentId:
 *              type: string
 *          courseId:
 *              type: string
 *          scorecardId:
 *              type: string
 *          leaderboardId:
 *              type: string
 *          handicapIndex:
 *              type: number
 *          tee:
 *              type: string
 */
export class TournamentEntryResponse {
    tournamentId: string;
    courseId: string;
    scorecardId: string;
    leaderboardId: string;
    handicapIndex: number;
    tee: string;
    teamName?: string;
}