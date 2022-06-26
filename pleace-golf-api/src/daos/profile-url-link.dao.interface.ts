import { DAO } from "../core/dao/dao.interface";
import { ProfileUrlLink } from "../types/profile-url-link";

/**
 * Represents data access for golf course.
 *
 * @interface
 */
export interface ProfileUrlLinkDAO extends DAO<ProfileUrlLink> {

    /**
    * Add profile link & url
    * @async
    * @returns {Promise<boolean>}
    */

    addProfileUrlLink(userId: string, url: string, link: string): Promise<boolean>;

}
