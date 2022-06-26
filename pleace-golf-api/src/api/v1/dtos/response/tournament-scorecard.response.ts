import { Score } from "../score";
import { GolfCourseResponse } from "./golf-course.response";

/**
 * @swagger
 * definitions:
 *  TournamentScorecardResponse:
 *      type: object
 *      properties:
 *          scorecardId:
 *              type: string
 *          tournamentId:
 *              type: string
 *          course:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/GolfCourseResponse'
 *          scores:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/Score'
 *          courseIndex:
 *              type: number
 *          tee:
 *              type: string
 */
export class TournamentScorecardResponse {
    scorecardId: string;
    tournamentId: string;
    course: GolfCourseResponse;
    scores: Score[];
    courseIndex: number;
    tee: string;
    teeId?: string;
    teamName?: string;
    handicapIndex?: number;
}