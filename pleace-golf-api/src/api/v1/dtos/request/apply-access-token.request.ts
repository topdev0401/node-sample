const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  ApplyAccessTokenRequest:
 *      type: object
 *      required:
 *          - accessToken
 *      properties:
 *          accessToken:
 *              type: string
 */
export class ApplyAccessTokenRequest {
    accessToken: string;
}

export const ApplyAccessTokenRequestSchema = [
    check('accessToken').exists({ checkFalsy: true })
];
