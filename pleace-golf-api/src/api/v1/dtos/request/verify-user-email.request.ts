const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  VerifyUserEmailRequest:
 *      type: object
 *      required:
 *          - email
 *          - verificationCode
 *      properties:
 *          email:
 *              type: string
 *          verificationCode:
 *              type: string
 */
export class VerifyUserEmailRequest {
    email: string;
    verificationCode: string;
}

export const VerifyUserEmailRequestSchema = [
    check('email').isEmail(),
    check('verificationCode').exists({ checkFalsy: true })
];
