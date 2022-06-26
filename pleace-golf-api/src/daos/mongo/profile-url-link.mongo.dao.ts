import { Logger } from "../../core/logging";
import { MongoDAO } from "../../core/dao/mongo/mongo.dao";
import { GolfCourse } from "../../types/golf-course";
import { GolfCourseDAO } from "../golf-course.dao.interface";
import { GolfCourseSchema } from "../../models/golf-course.model";

export class GolfCourseMongoDAO extends MongoDAO<GolfCourse> implements GolfCourseDAO {

    constructor() {
        super(GolfCourseSchema);
    }

    public async addGolfCourseTees(teesRequest: any): Promise<boolean> {
        const courseId = teesRequest.courseId;
        try {
            await GolfCourseSchema.findOneAndUpdate(
                {
                    _id: courseId,
                },
                {
                    $set: {
                        tees: teesRequest.tees
                    }
                },
                {
                    new: true
                }
            ).exec();
            return Promise.resolve(true);
        } catch (error) {
            Logger.error(`Could not update golf course tees. Error: ${error}`);
            throw error;
        }
    }


    public async update(golfCourse: GolfCourse): Promise<GolfCourse> {
        throw new Error("Not implemented.");
    }

    public async search(inputQuery: string, limit: number): Promise<GolfCourse[]> {
        throw new Error("Not implemented.");
    }

}
