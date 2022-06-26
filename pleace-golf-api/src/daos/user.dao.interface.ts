import { DAO } from "../core/dao/dao.interface";
import { User } from "../types/user";

/**
 * Represents data access for users.
 *
 * @interface
 */
export interface UserDAO extends DAO<User> {

    /**
    * Updates a user
    * NOTE: does not update id, password and email
    * @async
    * @param  {User} user User to update
    * @returns {Promise<User>} Returns a promise for a User object
    */
    update(user: User): Promise<User>;

    /**
     * Retrieves a user by username
     * @async
     * @param  {string} email User's email.
     * @returns Promise - Returns a promise for a user object.
     */
    getByEmail(email: string): Promise<User>;

    /**
     * Changes user password
     * @async
     * @param {string} id User id
     * @param {string} newPassword New user password
     * @returns {Promise<void>} Returns a promise
     */
    changePassword(id: string, newPassword: string): Promise<void>;

    getProfileUrlLinks(id: string): Promise<any>;

    addProfileUrlLink(id: string, linkName: string, linkUrl: string): Promise<boolean>;
}
