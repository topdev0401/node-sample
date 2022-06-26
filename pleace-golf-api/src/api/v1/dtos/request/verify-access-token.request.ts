const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  VerifyAccessTokenRequest:
 *      type: object
 *      required:
 *          - accessToken
 *      properties:
 *          accessToken:
 *              type: string
 */
export class VerifyAccessTokenRequest {
    accessToken: string;
}

export const VerifyAccessTokenRequestSchema = [
    check('accessToken').exists({ checkFalsy: true })
];
