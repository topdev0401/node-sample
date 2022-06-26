import { checkId } from "../../../../core/validation/validator";

const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  EnterTournamentRequest:
 *      type: object
 *      required:
 *          - accessToken
 *      properties:
 *          courseId:
 *              type: string
 *          handicapIndex:
 *              type: number
 *          tee:
 *              type: string
 */
export class EnterTournamentRequest {
    courseId: string;
    handicapIndex: number;
    tee: string;
    teamName?: string;
    accessToken?: string;
}

export const EnterTournamentRequestSchema = [
    checkId('tournamentId'),
    checkId('courseId'),
    check('handicapIndex').exists({ checkFalsy: true }).isNumeric(),
    check('tee').exists({ checkFalsy: true })
];
