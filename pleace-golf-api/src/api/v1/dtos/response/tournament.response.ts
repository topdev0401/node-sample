import { GolfCourseResponse } from "./golf-course.response";
import { GolfDivision } from "../../../../types/golf-division.enum";

/**
 * @swagger
 * definitions:
 *  TournamentResponse:
 *      type: object
 *      properties:
 *          tournamentId:
 *              type: string
 *          name:
 *              type: string
 *          regStartDate:
 *              type: string
 *              description: ISO 8601 format. pattern - YYYY-MM-DDTHH:mm:ss.sssZ
 *          regEndDate:
 *              type: string
 *              description: ISO 8601 format. pattern - YYYY-MM-DDTHH:mm:ss.sssZ
 *          startDate:
 *              type: string
 *              description: ISO 8601 format. pattern - YYYY-MM-DDTHH:mm:ss.sssZ
 *          endDate:
 *              type: string
 *              description: ISO 8601 format. pattern - YYYY-MM-DDTHH:mm:ss.sssZ
 *          divisions:
 *              type: array
 *              items:
 *                  type: string
 *                  enum: [Champ, Celebrity, Professional Golfer]
 *          courses:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/GolfCourseResponse'
 *                  
 */
export class TournamentResponse {
    tournamentId: string;
    name: string;
    regStartDate: string;
    regEndDate: string;
    startDate: string;
    endDate: string;
    divisions: GolfDivision[];
    courses: GolfCourseResponse[];
    type?: string;
    maxPlayers?:number;
    challengers?:string[];
    createdBy? : string;
}