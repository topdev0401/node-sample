import { checkId } from "../../../../core/validation/validator";
const { check } = require("express-validator");
/**
 * @swagger
 * definitions:
 *  LoginUserRequest:
 *      type: object
 *      required:
 *          - email
 *          - password
 *      properties:
 *          email:
 *              type: string
 *          password:
 *              type: string
 */
export class AddProfileLinkRequest {
    linkName: string;
    linkUrl: string;
}

export const AddProfileLinkRequestSchema = [
    check('linkName').isLength({ min: 1 }),
    check('linkUrl').isLength({ min: 1 })
];

