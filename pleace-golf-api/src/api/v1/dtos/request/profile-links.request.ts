import { checkId } from "../../../../core/validation/validator";

const { check } = require("express-validator");

export const ProfileLinksRequestSchema = [
    checkId('userId'),
];