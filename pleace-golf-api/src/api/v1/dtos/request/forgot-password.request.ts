const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  ForgotPasswordRequest:
 *      type: object
 *      required:
 *          - email
 *      properties:
 *          email:
 *              type: string
 */
export class ForgotPasswordRequest {
    email: string;
}

export const ForgotPasswordRequestSchema = [
    check('email').isEmail()
];
