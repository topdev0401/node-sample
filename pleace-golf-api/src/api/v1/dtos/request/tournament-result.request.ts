import { GolfDivision } from "../../../../types/golf-division.enum";
import { checkId } from "../../../../core/validation/validator";

const { check } = require("express-validator");

export const TournamentResultRequestSchema = [
    checkId('tournamentId'),
    check('division').exists({ checkFalsy: true }).isIn(Object.values(GolfDivision))
];
