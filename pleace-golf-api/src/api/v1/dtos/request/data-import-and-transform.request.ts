import { GolfDivision } from "../../../../types/golf-division.enum";
import { checkId } from "../../../../core/validation/validator";

const { check } = require("express-validator");

export const DataImportAndTransformRequestSchema = [
    check('key').exists({ checkFalsy: true })
];
