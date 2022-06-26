import { GolfDivision } from "../../../../types/golf-division.enum";

const { check } = require("express-validator");

export const TournamentResultSummaryRequestSchema = [
    check('division').exists({ checkFalsy: true }).isIn(Object.values(GolfDivision))
];
