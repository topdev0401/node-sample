import { checkCountry } from "../../../../core/validation/validator";
const { check } = require("express-validator");

export const GolfClubRequestSchema = [
    checkCountry("countryCode")
];
