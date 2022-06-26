import { GolfDivision } from "../../../../types/golf-division.enum";

/**
 * @swagger
 * definitions:
 *  TournamentLeaderboardResponse:
 *      type: object
 *      properties:
 *          position:
 *              type: number
 *          name:
 *              type: string
 *          countryCode:
 *              type: string
 *          total:
 *              type: number
 *          holes:
 *              type: number
 *          round1:
 *              type: number
 *                  
 */
export class TournamentLeaderboardResponse {
    position: number;
    name: string;
    countryCode: string;
    total: number;
    holes: number;
    round1: number;
    userId?:string;
    division?:GolfDivision;
    clubId?:string;
    clubName?:string;
    gender?: string;
    courseId?:string;
    courseName?: string;
    teamName?: string;
}