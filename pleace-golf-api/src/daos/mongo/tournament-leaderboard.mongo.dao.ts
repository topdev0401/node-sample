import { Logger } from "../../core/logging";
import { MongoDAO } from "../../core/dao/mongo/mongo.dao";
import { TournamentLeaderboard } from "../../types/tournament-leaderboard";
import { TournamentLeaderboardDAO } from "../tournament-leaderboard.dao.interface";
import { TournamentLeaderboardSchema } from "../../models/tournament-leaderboard.model";
import { GolfDivision } from "../../types/golf-division.enum";
import { User } from "../../types/user";

export class TournamentLeaderboardMongoDAO extends MongoDAO<TournamentLeaderboard> implements TournamentLeaderboardDAO {

    constructor() {
        super(TournamentLeaderboardSchema);
    }

    public async updateLeaderboard(userID: string, tournamentID: string, courseID: string, total: number, holes: number, round1: number): Promise<TournamentLeaderboard> {
        try {
            return await TournamentLeaderboardSchema.findOneAndUpdate(
                {
                    user: User.fromId(userID),
                    tournamentId: tournamentID,
                    courseId: courseID,
                },
                {
                    $set: {
                        total: total,
                        holes: holes,
                        round1: 1
                    }
                },
                {
                    new: true
                }
            ).exec();
        } catch (error) {
            Logger.error(`Could not update tournament leaderboard ${tournamentID}:${courseID}. Error: ${error}`);
            throw error;
        }
    }


    public async getLeaderboard(tournamentID: string, division?: GolfDivision): Promise<TournamentLeaderboard[]> {
        try {
            return TournamentLeaderboardSchema.find(
                {
                    tournamentId: tournamentID
                    /* ,division: division */
                }
            ).sort('-total').populate("user", ["firstName", "lastName", "nationality","gender"])
            .populate({path:"courseId",populate:{path:'clubId',model:'GolfClub'}}).exec();
        } catch (error) {
            Logger.error(`Could not get tournament leaderboard ${tournamentID}:${division}. Error: ${error}`);
            throw error;
        }
    }

    public async update(tournamentLeaderboard: TournamentLeaderboard): Promise<TournamentLeaderboard> {
        throw new Error("Not implemented.");
    }

    public async search(inputQuery: string, limit: number): Promise<TournamentLeaderboard[]> {
        throw new Error("Not implemented.");
    }

    public async updateAny(tournamentLeaderboard: TournamentLeaderboard): Promise<TournamentLeaderboard> {
        try {

            return await TournamentLeaderboardSchema.findOneAndUpdate(
                {
                    _id: tournamentLeaderboard._id,
                    user: tournamentLeaderboard.user
                },
                {
                    $set: tournamentLeaderboard
                },
                {
                    new: true
                }
            ).exec();
        } catch (error) {
            Logger.error(`Could not update any tournament leaderboard ${tournamentLeaderboard._id}. Error: ${error}`);
            throw error;
        }
    }

}
