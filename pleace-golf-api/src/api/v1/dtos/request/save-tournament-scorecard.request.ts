import { Score } from "../score";
import { checkId } from "../../../../core/validation/validator";

const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  SaveTournamentScorecardRequest:
 *      type: object
 *      required:
 *          - scores
 *      properties:
 *          scores:
 *              type: array
 *              items:
 *                  $ref: '#/definitions/Score'
 */
export class SaveTournamentScorecardRequest {
    scores: Score[];
}

export const SaveTournamentScorecardRequestSchema = [
    checkId('tournamentId'),
    checkId('scorecardId'),
    check('scores.*.hole').exists({ checkFalsy: true }).isNumeric(),
    check('scores.*.score').exists({ checkFalsy: true }).isNumeric()
];
