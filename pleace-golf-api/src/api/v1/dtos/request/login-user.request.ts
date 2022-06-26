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
export class LoginUserRequest {
    email: string;
    password: string;
}

export const LoginUserRequestSchema = [
    check('email').isEmail(),
    check('password').isLength({ min: 5 })
];

