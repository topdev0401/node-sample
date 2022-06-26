import * as bcrypt from "bcrypt";
import { Logger } from "../core/logging";
import { JWT } from "../core/auth/jwt";
import { UserDAO } from "../daos/user.dao.interface";
import { IUser } from "../interfaces/user.interface";
import { UserRegistrationForm } from "../types/user-registration-form";
import { User } from "../types/user";
import { ErrorBuilder } from "../core/errors/error-builder";
import { ErrorType } from "../core/errors/error-type.enum";
import { ErrorMessage } from "../types/error-message.enum";
import { TokenGenerator } from "../core/auth/token-generator";
import { UserVerificationCode } from "../types/user-verification-code";
import { AccessToken } from "../types/access-token";
import { DAO } from "../core/dao/dao.interface";
import { FilterBuilder } from "../core/dao/filter/filter-builder";
import { IJobScheduler } from "../core/jobs/job-scheduler.interface";
import { Job } from "../jobs/job.enum";
import { AccountStatus } from "../types/account-status.enum";
import config from '../config';
import { GolfDivision } from "../types/golf-division.enum";
import { LatestRankSchema } from "../models/latest-rank.model";

export class UserService {

    private readonly userDAO: UserDAO;
    private readonly accessTokenDAO: DAO<AccessToken>;
    private readonly jobScheduler: IJobScheduler;

    public constructor(userDAO: UserDAO, accessTokenDAO: DAO<AccessToken>, jobScheduler: IJobScheduler)
    {
        this.userDAO = userDAO;
        this.accessTokenDAO = accessTokenDAO;
        this.jobScheduler = jobScheduler;
    }

    /**
     * Register user
     * @async
     * @param {UserRegistrationForm} userRegistrationForm User's registration form
     * @returns {Promise<IUser>} Returns promise of user
     */
    public async registerUser(userRegistrationForm: UserRegistrationForm): Promise<IUser> {
        let result: Promise<IUser> = undefined;
        try {
            let savedUser: IUser;
            const storedUser: IUser = await this.userDAO.getByEmail(userRegistrationForm.email);
            if (storedUser) {
                result = Promise.reject(ErrorBuilder.generate(ErrorType.Exists, ErrorMessage.UserExists(userRegistrationForm.email)));
            } else {

                // Check access token
                if (userRegistrationForm.accessToken) {
                    await this.verifyAccessToken(userRegistrationForm.accessToken);
                }

                const user = this.mapUserRegistrationForm(userRegistrationForm);
                // Set email verification code
                user.emailVerificationCode = await TokenGenerator.generateToken(Number(config.verificationCodeLength));
                
                //set free tokens for amateurs 
                if(user.division === GolfDivision.Champ) {
                    user.amateurTokens = this.getFreeAmateurTokens();
                }
                // Create user
                savedUser = await this.userDAO.create(user);
                
                // Apply access token
                if (userRegistrationForm.accessToken) {
                    await this.applyAccessToken(savedUser._id, userRegistrationForm.accessToken);
                }

                // Schedule user email verification job
                await this.jobScheduler.now(Job.UserEmailVerificationJob, {user: savedUser});
            }

            if (!result) {
                this.mappedUserWithLatestRank(savedUser);
                result = Promise.resolve(savedUser);
            }

        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }

        return result;
    }
    

    private  getFreeAmateurTokens() {
        let tokens = [];
        for(let i=0; i< 3 ; i++) {
            let token = Math.random().toString(36).substr(2, 10).toUpperCase();
            tokens.push(token);
        }
        return tokens;
    }

    public async mappedUserWithLatestRank(savedUser:IUser) {
        const usersInRank = await LatestRankSchema.find({
            firstName:{$regex: savedUser.firstName, $options: "i"}, //savedUser.firstName,
            lastName:{$regex: savedUser.lastName, $options: "i"},
            division:savedUser.division,
            nationality:savedUser.nationality,
            user : undefined
        });
        if(usersInRank?.length === 1) {
            const userInRank = usersInRank[0];
            await LatestRankSchema.findOneAndUpdate({
                    _id: userInRank._id
                },
                {
                    $set:{
                        user : savedUser
                    }
                },
                {
                    new: true
                }
            ).exec();
        }
    }

    /**
     * Request email verification code
     * @async
     * @param {string} userID The user's ID
     * @returns {Promise<UserVerificationCode>} Returns promise of user verification code
     */
    public async requestEmailVerificationCode(userID: string): Promise<UserVerificationCode> {
        try {
            const user: IUser = await this.userDAO.getByID(userID);
            if (!user) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }
            if (user.isConfirmed) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Exists, ErrorMessage.EmailConfirmed(user.email)));
            } else {
                user.emailVerificationCode = await TokenGenerator.generateToken(Number(config.verificationCodeLength))
                await this.userDAO.update(user);

                return Promise.resolve({
                    userId: user._id,
                    verificationCode: user.emailVerificationCode
                } as UserVerificationCode);
            }
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generateGeneric(ErrorMessage.EmailVerificationCode(userID), error.message));
        }
    }

    /**
     * Verify user email
     * @async
     * @param {any} userEmail The email of the user.
     * @param {any} verificationCode The verification token sent to the user's email
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async verifyUserEmail(userEmail: string, verificationCode: any): Promise<boolean> {
        try {
            const user: IUser = await this.userDAO.getByEmail(userEmail);
            if (!user) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }

            const isVerifyEmailVerificationCodeValid: boolean = verificationCode === user.emailVerificationCode ? true : false;

            if (!isVerifyEmailVerificationCodeValid) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.InvalidCode, ErrorMessage.InvalidEmailOrVerificationCode));
            }

            user.isConfirmed = true;
            user.emailVerificationCode = undefined;

            await this.userDAO.update(user);

            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Sends a security code which is needed for resetting the users password.
     * @async
     * @param {string} userEmail The email of the user.
     * @param {ErrorCondition<string>[]} errors Error conditions
     * @returns {Promise<boolean>} User verification code.
     */
    public async resetPasswordVerificationCode(userEmail: string): Promise<boolean> {
        try {
            let user: IUser = await this.userDAO.getByEmail(userEmail);
            if (!user || !user.isConfirmed || user.status !== AccountStatus.Active) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }
            // Set reset password verification code
            user.resetPasswordVerificationCode = await TokenGenerator.generateToken(Number(config.verificationCodeLength))
            // Update user
            user = await this.userDAO.update(user);
            // Schedule user forgot password request job
            await this.jobScheduler.now(Job.UserForgotPasswordRequestJob, { user: user });

            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generateGeneric(ErrorMessage.ResetVerificationCode(userEmail), error.message));
        }
    }

    /**
     * Resets the user's password and sends the new password.
     * @async
     * @param {string} userEmail The email of the user.
     * @param {string?} verificationCode The verification code needed for authentication.
     * @param {string?} newPassword The new password.
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async resetPassword(userEmail: string, verificationCode: string, newPassword: string): Promise<boolean> {
        try {
            const user: IUser = await this.userDAO.getByEmail(userEmail);
            if (!user) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }

            const isResetPasswordVerificationCodeValid: boolean = verificationCode === user.resetPasswordVerificationCode ? true : false;
    
            if (!isResetPasswordVerificationCodeValid) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.InvalidCode, ErrorMessage.InvalidEmailOrVerificationCode));
            }

            user.password = newPassword;
            user.resetPasswordVerificationCode = undefined;

            await this.userDAO.update(user);
            await this.userDAO.changePassword(user._id, user.password);

            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generateGeneric(ErrorMessage.ResetPassword(userEmail), error.message));
        }
    }


    /**
     * Update user
     * @async
     * @param {string} userID The id of the user
     * @param {any} fieldsToUpdate Fields that should be updated
     * @returns {Promise<IUser>} Returns promise of user
     */
    public async updateUser(userID: string, fieldsToUpdate: any): Promise<any> {

        let result: Promise<object> = undefined;
        try {
            const user: IUser = await this.userDAO.getByID(userID);
            if (!user) {
                result = Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            } else {
                this.updateUserModel(user, fieldsToUpdate);
                await this.userDAO.update(user);
                result = Promise.resolve(user);
            }
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }

        return result;
    }

    /**
     * Delete user
     * @async
     * @param {string} userID The id of the user
     * @param {string} password The password of the user
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async deleteUser(userID: string, password: string): Promise<boolean> {
        try {
            const user: IUser = await this.userDAO.getByID(userID);
            if (!user) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }
            const isPasswordCorrect: boolean = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }
            const deleted = await this.userDAO.delete(user._id);
            if (!deleted) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }
            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
    * Used to change the users password.
    * @async
    * @param {string} userID The ID of the user.
    * @param {string} oldPassword The old password.
    * @param {string} newPassword The new password.
    * @returns {Promise<string>} A message for the operation result.
    */
    public async changePassword(userID: string, oldPassword: string, newPassword: string): Promise<string> {
        try {
            const user: IUser = await this.userDAO.getByID(userID);
            if (!user) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.UserDoesNotExist));
            }

            const isPasswordCorrect: boolean = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Authentication, ErrorMessage.InvalidCredentials));
            }

            await this.userDAO.changePassword(user._id, newPassword);
            return Promise.resolve(user._id);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generateGeneric(ErrorMessage.ChangePassword(userID), error.message));
        }
    }

    /**
    * Fetches a user by id.
    * @async
    * @param {string} userID The id of the user.
    * @returns {Promise<IUser>} The fetched user.
    */
    public async getUserById(userID: string): Promise<IUser> {
        try {
            const user: IUser = await this.userDAO.getByID(userID);
            if (!user) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.UserDoesNotExist));
            }

            return user;
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generateGeneric(ErrorMessage.GetByID(userID), error.message));
        }
    }

    /**
    * Get User By Email
    * @async
    * @param {string} email User's email
    * @returns {Promise<IUser>} Returns promise of user
    */
    public async getUserByEmail(email: string): Promise<IUser> {
        return this.userDAO.getByEmail(email);
    }

    /**
     * Verify Access Token
     * @async
     * @param {string} accessToken Division access token
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async verifyAccessToken(accessToken: string): Promise<boolean> {
        try {
            const filter = new FilterBuilder()
                .addFilter("token", accessToken)
                .buildFirst();

            const storedAccessToken: AccessToken = await this.accessTokenDAO.getByFilter(filter);
            if (!storedAccessToken) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.InvalidCode, ErrorMessage.InvalidAccessToken));
            }
            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Apply Access Token
     * @async
     * @param {string} userID The id of the user.
     * @param {string} accessToken Division access token
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async applyAccessToken(userID: string, accessToken: string): Promise<boolean> {
        try {
            const filter = new FilterBuilder()
                .addFilter("token", accessToken)
                .buildFirst();

            const storedAccessToken: AccessToken = await this.accessTokenDAO.getByFilter(filter);
            if (!storedAccessToken) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.InvalidCode, ErrorMessage.InvalidAccessToken));
            }

            const user: IUser = await this.userDAO.getByID(userID);
            if (!user) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.UserDoesNotExist));
            }

            const golfDivision = storedAccessToken.golfDivision;
            user.division = golfDivision;
            await this.userDAO.update(user);

            await this.accessTokenDAO.delete(storedAccessToken._id);

            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getUserProfileUrlLinks(userID: string): Promise<any> {
        try {
            this.userDAO.getProfileUrlLinks(userID);
        } catch(error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async addUserProfileUrlLink(userID: string, linkName: string, linkUrl: string): Promise<boolean> {
        try {
            return this.userDAO.addProfileUrlLink(userID, linkName, linkUrl);
        } catch(error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    mapUserRegistrationForm(userRegistrationForm: UserRegistrationForm): IUser {
        const newUser: User = new User();
        newUser.email = userRegistrationForm.email;
        newUser.password = userRegistrationForm.password;
        newUser.firstName = userRegistrationForm.firstName;
        newUser.lastName = userRegistrationForm.lastName;
        newUser.nationality = userRegistrationForm.nationality;
        newUser.countryOfResidence = userRegistrationForm.countryOfResidence;
        newUser.handicapIndex = userRegistrationForm.handicapIndex;
        newUser.pgaMemberNumber = userRegistrationForm.pgaMemberNumber ? userRegistrationForm.pgaMemberNumber : null;
        newUser.accessToken = userRegistrationForm.accessToken ? userRegistrationForm.accessToken : null;
        newUser.division = userRegistrationForm.division;
        newUser.homeClub = userRegistrationForm.homeClub;
        newUser.gender = userRegistrationForm.gender;
        newUser.state = userRegistrationForm.state;
        newUser.links = [];
        return newUser;
    }

    updateUserModel(user: User, fieldsToUpdate: any) {
        user.firstName = fieldsToUpdate.firstName;
        user.lastName = fieldsToUpdate.lastName;
        user.nationality = fieldsToUpdate.nationality;
        user.countryOfResidence = fieldsToUpdate.countryOfResidence;
        user.state = fieldsToUpdate.state;
        user.handicapIndex = fieldsToUpdate.handicapIndex;
        user.homeClub = fieldsToUpdate.homeClub;
        user.gender = fieldsToUpdate.gender;
        user.email = fieldsToUpdate.email;
        user.links = fieldsToUpdate.links;
    }
}
