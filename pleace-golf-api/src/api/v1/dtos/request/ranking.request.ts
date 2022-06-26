import { checkId, checkCountry, checkCountryOptional } from "../../../../core/validation/validator";
import { GolfDivision } from "../../../../types/golf-division.enum";

const { check, checkSchema } = require("express-validator");

export const RankingRequestSchema = [
    check('countryCode').toArray(),
    checkCountryOptional("countryCode.*"),
    check('division').exists({ checkFalsy: true }).isIn(Object.values(GolfDivision))
];
