import { UserProfileResponse } from "./user-profile.response";

/**
 * @swagger
 * definitions:
 *  LoginUserResponse:
 *      type: object
 *      properties:
 *          user:
 *              type: object
 *              $ref: '#/definitions/UserProfileResponse'
 *          token:
 *              type: string
 */
export class LoginUserResponse {
    user: UserProfileResponse;
    token: string;
}