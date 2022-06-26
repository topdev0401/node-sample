import { Request, Response, NextFunction } from "express";
import * as passport from "passport";
import { Router } from "express";
import { UserService } from "../../../services/user.service";
import { UserRegistrationForm } from "../../../types/user-registration-form";
import { validate, CheckUserIdInPathMatchJWT } from "../../../core/validation/validator";
import { RegisterUserRequestSchema } from "../dtos/request";
import { User } from "../../../types/user";
import { Logger } from "../../../core/logging";
import { wrapAsyncWithErrorHandling } from "../../handlers/error-handler";
import { ChangeUserPasswordRequestSchema, ChangeUserPasswordRequest } from "../dtos/request/change-user-password.request";
import { ForgotPasswordRequestSchema, ForgotPasswordRequest } from "../dtos/request/forgot-password.request";
import { ResetUserPasswordRequest, ResetUserPasswordRequestSchema } from "../dtos/request/reset-user-password.request";
import { UserProfileRequestSchema } from "../dtos/request/user-profile.request";
import { UserProfileResponse } from "../dtos/response/user-profile.response";
import { VerifyUserEmailRequest, VerifyUserEmailRequestSchema } from "../dtos/request/verify-user-email.request";
import { UpdateUserProfileRequestSchema, UpdateUserProfileRequest } from "../dtos/request/update-user-profile.request";
import { VerifyAccessTokenRequestSchema, VerifyAccessTokenRequest } from "../dtos/request/verify-access-token.request";
import { ApplyAccessTokenRequestSchema, ApplyAccessTokenRequest } from "../dtos/request/apply-access-token.request";
import { Mapper } from "../mapper";
import { DeleteUserProfileRequestSchema, DeleteUserProfileRequest } from "../dtos/request/delete-user-profile.request";
import { ProfileLinksRequestSchema } from "../dtos/request/profile-links.request";
import { AddProfileLinkRequestSchema, AddProfileLinkRequest } from "../dtos/request/add-profile-link.request";

export class UserController {
    private readonly userService: UserService;
    private router: Router;

    constructor(userService: UserService) {
        this.userService = userService;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = Router();
        this.router.post("/", RegisterUserRequestSchema, validate, wrapAsyncWithErrorHandling(this.registerUser, this));

        this.router.post("/verify-email", VerifyUserEmailRequestSchema, validate, wrapAsyncWithErrorHandling(this.verifyEmail, this));

        this.router.post("/access-token", VerifyAccessTokenRequestSchema, validate, wrapAsyncWithErrorHandling(this.verifyAccessToken, this));

        this.router.post("/forgot-password", ForgotPasswordRequestSchema, validate, wrapAsyncWithErrorHandling(this.forgotPassword, this));

        this.router.post("/reset-password", ResetUserPasswordRequestSchema, validate, wrapAsyncWithErrorHandling(this.resetPassword, this));

        this.router.post("/:userId", passport.authenticate("jwt", { session: false }), UpdateUserProfileRequestSchema, validate, wrapAsyncWithErrorHandling(this.updateUserProfile, this));

        this.router.get("/:userId", passport.authenticate("jwt", { session: false }), UserProfileRequestSchema, validate, wrapAsyncWithErrorHandling(this.getUserProfile, this));

        this.router.post("/:userId/change-password", passport.authenticate("jwt", { session: false }), ChangeUserPasswordRequestSchema, validate, CheckUserIdInPathMatchJWT, validate, wrapAsyncWithErrorHandling(this.changePassword, this));

        this.router.post("/:userId/access-token", passport.authenticate("jwt", { session: false }), ApplyAccessTokenRequestSchema, validate, CheckUserIdInPathMatchJWT, validate, wrapAsyncWithErrorHandling(this.applyAccessToken, this));

        this.router.post("/:userId/delete-profile", passport.authenticate("jwt", { session: false }), DeleteUserProfileRequestSchema, validate, CheckUserIdInPathMatchJWT, validate, wrapAsyncWithErrorHandling(this.deleteProfile, this));

        this.router.get("/:userId/profile-links", passport.authenticate("jwt", { session: false }), ProfileLinksRequestSchema, validate, CheckUserIdInPathMatchJWT, validate, wrapAsyncWithErrorHandling(this.getProfileLinks, this));

        this.router.post("/:userId/profile-links", passport.authenticate("jwt", { session: false }), AddProfileLinkRequestSchema, validate, CheckUserIdInPathMatchJWT, validate, wrapAsyncWithErrorHandling(this.addProfileLink, this));
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * @swagger
     * /user/:
     *  post:
     *      description: Register a user.
     *      tags:
     *          - User
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: register
     *            type: RegisterUserRequest
     *            in: body
     *            schema:
     *               $ref: '#/definitions/RegisterUserRequest'
     *      responses:
     *          200:
     *              description: OK
     *          400:
     *              description: Missing or invalid parameter.
     *          500:
     *              description: Server error
     */
    public async registerUser(req: Request, res: Response, next: NextFunction) {
        const userRegistrationForm = req.body as UserRegistrationForm;
        const result = await this.userService.registerUser(userRegistrationForm);

        res.status(200).send(result);
    }

    /**
    * @swagger
    * /user/verify-email:
    *  post:
    *      description: Verify user email
    *      tags:
    *          - User
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: verifyEmail
    *            type: VerifyUserEmailRequest
    *            in: body
    *            schema:
    *               $ref: '#/definitions/VerifyUserEmailRequest'
    *      responses:
    *          200:
    *              description: OK
    *          400:
    *              description: Missing or invalid parameter
    *          500:
    *              description: Server error
    */
    public async verifyEmail(req: Request, res: Response, next: NextFunction) {
        const verifyUserEmailRequest = req.body as VerifyUserEmailRequest;
        await this.userService.verifyUserEmail(
            verifyUserEmailRequest.email,
            verifyUserEmailRequest.verificationCode
        );

        res.status(200).send();
    }

    /**
     * @swagger
     * /user/{userId}:
     *  post:
     *      description: Update user profile
     *      tags:
     *          - User
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: userId
     *            type: string
     *            required: true
     *            in: path
     *          - name: updateProfile
     *            type: UpdateUserProfileRequest
     *            in: body
     *            schema:
     *               $ref: '#/definitions/UpdateUserProfileRequest'
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/UserProfileResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async updateUserProfile(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        const updateUserProfileRequest = req.body as UpdateUserProfileRequest;
        const user = await this.userService.updateUser(userId, updateUserProfileRequest);

        res.status(200).send(Mapper.mapUserToUserProfile(user));
    }



    /**
     * @swagger
     * /user/{userId}:
     *  get:
     *      description: Gets user profile
     *      tags:
     *          - User
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: userId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/UserProfileResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getUserProfile(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        const user = await this.userService.getUserById(userId);

        res.status(200).send(Mapper.mapUserToUserProfile(user));
    }

    /**
    * @swagger
    * /user/{userId}/change-password:
    *  post:
    *      description: Change user password
    *      tags:
    *          - User
    *      produces:
    *          - application/json
    *      parameters:
    *          - in: path
    *            name: userId
    *            required: true
    *            type: string
    *          - name: changePassword
    *            type: ChangeUserPasswordRequest
    *            in: body
    *            schema:
    *               $ref: '#/definitions/ChangeUserPasswordRequest'
    *      responses:
    *          200:
    *              description: OK
    *          400:
    *              description: Missing or invalid parameter
    *          500:
    *              description: Server error
    */
    public async changePassword(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        const changeUserPasswordRequest = req.body as ChangeUserPasswordRequest;
        await this.userService.changePassword(
            userId,
            changeUserPasswordRequest.oldPassword,
            changeUserPasswordRequest.newPassword
        );

        res.status(200).send();
    }

    /**
    * @swagger
    * /user/{userId}/access-token:
    *  post:
    *      description: Apply access token
    *      tags:
    *          - User
    *      produces:
    *          - application/json
    *      parameters:
    *          - in: path
    *            name: userId
    *            required: true
    *            type: string
    *          - name: applyAccessToken
    *            type: ApplyAccessTokenRequest
    *            in: body
    *            schema:
    *               $ref: '#/definitions/ApplyAccessTokenRequest'
    *      responses:
    *          200:
    *              description: OK
    *          400:
    *              description: Missing or invalid parameter
    *          500:
    *              description: Server error
    */
    public async applyAccessToken(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        const applyAccessTokenRequest = req.body as ApplyAccessTokenRequest;
        await this.userService.applyAccessToken(
            userId,
            applyAccessTokenRequest.accessToken
        );

        res.status(200).send();
    }

    /**
    * @swagger
    * /user/{userId}/delete-profile:
    *  post:
    *      description: Delete user profile
    *      tags:
    *          - User
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: deleteProfile
    *            type: DeleteUserProfileRequest
    *            in: body
    *            schema:
    *               $ref: '#/definitions/DeleteUserProfileRequest'
    *      responses:
    *          200:
    *              description: OK
    *          400:
    *              description: Missing or invalid parameter
    *          500:
    *              description: Server error
    */
    public async deleteProfile(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        const deleteUserProfileRequest = req.body as DeleteUserProfileRequest;
        await this.userService.deleteUser(
            userId,
            deleteUserProfileRequest.password
        );

        res.status(200).send();
    }

    /**
    * @swagger
    * /user/access-token:
    *  post:
    *      description: Verify access token
    *      tags:
    *          - User
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: verifyAccessToken
    *            type: VerifyAccessTokenRequest
    *            in: body
    *            schema:
    *               $ref: '#/definitions/VerifyAccessTokenRequest'
    *      responses:
    *          200:
    *              description: OK
    *          400:
    *              description: Missing or invalid parameter
    *          500:
    *              description: Server error
    */
    public async verifyAccessToken(req: Request, res: Response, next: NextFunction) {
        const verifyAccessTokenRequest = req.body as VerifyAccessTokenRequest;
        await this.userService.verifyAccessToken(
            verifyAccessTokenRequest.accessToken
        );

        res.status(200).send();
    }

    /**
     * @swagger
     * /user/forgot-password:
     *  post:
     *      description: Request forgot password verification code
     *      tags:
     *          - User
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: forgotPassword
     *            type: ForgotPasswordRequest
     *            in: body
     *            schema:
     *               $ref: '#/definitions/ForgotPasswordRequest'
     *      responses:
     *          200:
     *              description: OK
     *          400:
     *              description: Missing or invalid parameter
     *          500:
     *              description: Server error
     */
    public async forgotPassword(req: Request, res: Response, next: NextFunction) {
        const changeUserPasswordRequest = req.body as ForgotPasswordRequest;
        await this.userService.resetPasswordVerificationCode(
            changeUserPasswordRequest.email
        );

        res.status(200).send();
    }

    /**
    * @swagger
    * /user/resetPassword:
    *  post:
    *      description: Reset user password with verification code from forgot password request
    *      tags:
    *          - User
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: resetPassword
    *            type: ResetUserPasswordRequest
    *            in: body
    *            schema:
    *               $ref: '#/definitions/ResetUserPasswordRequest'
    *      responses:
    *          200:
    *              description: OK
    *          400:
    *              description: Missing or invalid parameter
    *          500:
    *              description: Server error
    */
    public async resetPassword(req: Request, res: Response, next: NextFunction) {
        const changeUserPasswordRequest = req.body as ResetUserPasswordRequest;
        await this.userService.resetPassword(
            changeUserPasswordRequest.email,
            changeUserPasswordRequest.verificationCode,
            changeUserPasswordRequest.newPassword
        );

        res.status(200).send();
    }

    public async getProfileLinks(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;
        const links = await this.userService.getUserProfileUrlLinks(userId);

        res.status(200).send({
            links
        });
    }

    public async addProfileLink(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;
        const addProfileLinkRequest = req.body as AddProfileLinkRequest;
        
        const success = await this.userService.addUserProfileUrlLink(
            userId,
            addProfileLinkRequest.linkName,
            addProfileLinkRequest.linkUrl
        )

        res.status(200).send({
            status: success
        })
    }
}