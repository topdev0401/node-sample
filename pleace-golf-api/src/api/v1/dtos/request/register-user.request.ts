import { Gender } from "../../../../types/gender.enum";
import { checkCountry } from "../../../../core/validation/validator";

const { check } = require("express-validator");

/**
 * @swagger
 * definitions:
 *  RegisterUserRequest:
 *      type: object
 *      required:
 *          - email
 *          - password
 *          - firstName
 *          - lastName
 *          - nationality
 *          - countryOfResidence
 *          - handicapIndex
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 *          firstName:
 *              type: string
 *          lastName:
 *              type: string
 *          nationality:
 *              type: string
 *          countryOfResidence:
 *              type: string
 *          handicapIndex:
 *              type: number
 *          accessToken:
 *              type: string
 */
export class RegisterUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    nationality: string;
    countryOfResidence: string;
    handicapIndex: number;
    accessToken?: string;
}

export const RegisterUserRequestSchema = [
    check('email').isEmail(),
    check('password').isLength({ min: 5 }),
    check("firstName").exists({ checkFalsy: true }),
    check("lastName").exists({ checkFalsy: true }),
    checkCountry("nationality"),
    checkCountry("countryOfResidence"),
    check("handicapIndex").exists({ checkFalsy: true }).isNumeric(),
    check('accessToken').optional({ checkFalsy: true })
];