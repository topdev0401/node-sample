const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  ResetUserPasswordRequest:
 *      type: object
 *      required:
 *          - email
 *          - verificationCode
 *          - newPassword
 *      properties:
 *          email:
 *              type: string
 *          verificationCode:
 *              type: string
 *          newPassword:
 *              type: string
 */
export class ResetUserPasswordRequest {
    email: string;
    verificationCode: string;
    newPassword: string;
}

export const ResetUserPasswordRequestSchema = [
    check('email').isEmail(),
    check('verificationCode').exists({ checkFalsy: true }),
    check('newPassword').isLength({ min: 5 }),
];
