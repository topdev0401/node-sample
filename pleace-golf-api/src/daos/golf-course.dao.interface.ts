import { DAO } from "../core/dao/dao.interface";
import { GolfCourse } from "../types/golf-course";

/**
 * Represents data access for golf course.
 *
 * @interface
 */
export interface GolfCourseDAO extends DAO<GolfCourse> {

    /**
    * Add golf coursee tees
    * @async
    * @returns {Promise<boolean>}
    */
    addGolfCourseTees(tees: any): Promise<boolean>;


}
