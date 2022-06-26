import { checkId } from "../../../../core/validation/validator";

const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  ChangeUserPasswordRequest:
 *      type: object
 *      required:
 *          - oldPassword
 *          - newPassword
 *      properties:
 *          oldPassword:
 *              type: string
 *          newPassword:
 *              type: string
 */
export class ChangeUserPasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export const ChangeUserPasswordRequestSchema = [
    checkId('userId'),
    check('oldPassword').isLength({ min: 5 }),
    check('newPassword').isLength({ min: 5 })
];
