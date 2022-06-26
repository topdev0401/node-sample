import { checkId } from "../../../../core/validation/validator";

const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  DeleteUserProfileRequest:
 *      type: object
 *      required:
 *          - password
 *      properties:
 *          password:
 *              type: string
 */
export class DeleteUserProfileRequest {
    password: string;
}

export const DeleteUserProfileRequestSchema = [
    checkId('userId'),
    check('password').isLength({ min: 5 }),
];
