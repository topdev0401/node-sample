import { Request, Response, NextFunction, Router } from "express";
import * as passport from "passport";
import { IVerifyOptions } from "passport-local";
import { AuthenticationService } from "../../../services/authentication.service";
import { LoginUserRequest } from "../dtos/request";
import { LoginUserResponse } from "../dtos/response";
import { IUser } from "../../../interfaces/user.interface";
import { ErrorType } from "../../../core/errors/error-type.enum";
import { ErrorWriter } from "../../../core/errors/error-writer";
import { UserService } from "../../../services/user.service";
import { Mapper } from "../mapper";
import { AccountStatus } from "../../../types/account-status.enum";
import { ErrorMessage } from "../../../types/error-message.enum";


export class AuthenticationController {
    private readonly authService: AuthenticationService;
    private readonly userService: UserService;
    private router: Router;

    constructor(authService: AuthenticationService, userService: UserService) {
        this.authService = authService;
        this.userService = userService;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = Router();
        this.router.post("/login",
            (req: any, res: any, next: any) => { this.login(req, res, next); });
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * @swagger
     * /auth/login:
     *  post:
     *      description: Attempts to log user in
     *      tags:
     *          - Auth
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: login
     *            type: LoginUserRequest
     *            in: body
     *            schema:
     *               $ref: '#/definitions/LoginUserRequest'
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/LoginUserResponse'
     *          400:
     *              description: Missing or invalid parameter
     *          401:
     *              description: Invalid credentials
     *          500:
     *              description: Server error
     */
    public async login(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local", { session: false }, (err: Error, user: IUser, info: IVerifyOptions) => {
            if (err) { return next(err); }
            if (!user) {
                ErrorWriter.writeErrorTypeResponse(ErrorType.Authentication, info.message, res);
            }
            else if (user.status === AccountStatus.Disabled) {
                ErrorWriter.writeErrorTypeResponse(ErrorType.Authentication, ErrorMessage.AccountDisabled, res);
            }
            else if (!user.isConfirmed) {
                ErrorWriter.writeErrorTypeResponse(ErrorType.Authentication, ErrorMessage.AccountNotConfirmed, res);
            }
            else {
                req.login(user, (err) => {
                    if (err) { return next(err); }
                
                    // Return JWT
                    this.authService.authenticateUser(user._id).then((jwt: string) => {
                        res.status(200).send({
                            user: Mapper.mapUserToUserProfile(user),
                            token: jwt,
                        } as LoginUserResponse);
                    });
                });
            }

        })(req, res, next);
    }
}