import { checkId, checkCountry, checkCountryOptional } from "../../../../core/validation/validator";

const { check, checkSchema } = require("express-validator");

export const IndividualRankingRequestSchema = [
    check('countryCode').toArray(),
    checkCountryOptional("countryCode.*")
];
