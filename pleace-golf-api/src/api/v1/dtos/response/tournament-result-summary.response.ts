
/**
 * @swagger
 * definitions:
 *  TournamentResultSummaryResponse:
 *      type: object
 *      properties:
 *          tournamentId:
 *              type: string
 *          startDate:
 *              type: string
 *              description: ISO 8601 format. pattern - YYYY-MM-DDTHH:mm:ss.sssZ
 *          endDate:
 *              type: string
 *              description: ISO 8601 format. pattern - YYYY-MM-DDTHH:mm:ss.sssZ
 *          name:
 *              type: string
 *                  
 */
export class TournamentResultSummaryResponse {
    tournamentId: string;
    startDate: string;
    endDate: string;
    name: string;
    type?: string;
}