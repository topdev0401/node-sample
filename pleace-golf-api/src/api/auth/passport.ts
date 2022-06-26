import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as passportJWT from "passport-jwt";
import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { PassportStatic } from "passport";
import config from '../../config';
import { UserService } from "../../services/user.service";
import { IUser } from "../../interfaces/user.interface";
import { ErrorMessage } from "../../types/error-message.enum";
import { Logger } from "../../core/logging";

const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

export namespace PassportAuth {

    passport.serializeUser((jwtPayload, done) => {
        Logger.info("serializeUser");
        //done(undefined, user._id);
        done(undefined, jwtPayload);
    });

    passport.deserializeUser((jwtPayload, done) => {
        Logger.info("deserializeUser");
        done(undefined, jwtPayload);
    });




    /**
     * Login Required middleware.
     */
    export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            return next();
        }
    };

    export function configAuth(passport: PassportStatic, userService: UserService) {
        /**
         * Authenticate with Email and Password.
         */
        passport.use(new LocalStrategy({ usernameField: "email", session: false }, async function(email, password, done){
            const user: IUser = await userService.getUserByEmail(email);
            if (!user) {
                return done(undefined, false, { message: ErrorMessage.InvalidCredentials });
            }
            const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                //return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, this.errors.InvalidCredentials));
                return done(undefined, false, { message: ErrorMessage.InvalidCredentials });
            }
            return done(undefined, user);
        }));

        /**
        * Authenticate with JWT
        * 
        */
        var opts : any = {}
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = config.jwtSecret;
        opts.issuer = config.jwtIssuer;
        opts.audience = config.jwtAudience;
        opts.algorithm = ["HS512"];

        passport.use(new JWTStrategy(opts, function (jwtPayload, done) {
            return done(null, jwtPayload);
            /*User.findOne({ id: jwtPayload.sub }, function (err, user) {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });*/
        }));
    }


    /**
     * Authorization Required middleware.
 
    export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
        const provider = req.path.split("/").slice(-1)[0];

        const user = req.user as UserDocument;
        if (_.find(user.tokens, { kind: provider })) {
            next();
        } else {
            res.redirect(`/auth/${provider}`);
        }
    };*/
}