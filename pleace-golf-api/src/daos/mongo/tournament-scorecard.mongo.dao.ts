import { Logger } from "../../core/logging";
import { MongoDAO } from "../../core/dao/mongo/mongo.dao";
import { TournamentScorecard } from "../../types/tournament-scorecard";
import { TournamentScorecardSchema } from "../../models/tournament-scorecard.model";
import { Score } from "../../types/score";
import { TournamentScorecardDAO } from "../tournament-scorecard.dao.interface";
import { Gender } from "../../types/gender.enum";

export class TournamentScorecardMongoDAO extends MongoDAO<TournamentScorecard> implements TournamentScorecardDAO {

    constructor() {
        super(TournamentScorecardSchema);
    }
    

    public async getScorecard(userID: string, scorecardID: string): Promise<TournamentScorecard> {
        try {
            return TournamentScorecardSchema
                .findOne({
                    _id: scorecardID,
                    userId: userID
                })
                .populate({
                    path: "course",
                    //match: {
                    //    "course.tees.name": "YELLOW",
                        //"course.tees.gender": gender
                    //},
                })
                .exec();
        } catch (error) {
            Logger.error(`Could not get all available tournaments. Error: ${error}`);
            throw error;
        }
    }

    public async getPlayerScorecard(userID: string, tournamentId: string): Promise<TournamentScorecard> {
        try {
            return TournamentScorecardSchema
                .findOne({
                    tournamentId: tournamentId,
                    userId: userID
                })
                .populate({
                    path: "course",
                    //match: {
                    //    "course.tees.name": "YELLOW",
                        //"course.tees.gender": gender
                    //},
                })
                .exec();
        } catch (error) {
            Logger.error(`Could not get all available tournaments. Error: ${error}`);
            throw error;
        }
    }

    public async updateScores(userID: string, scorecardID: string, scores: Score[]): Promise<TournamentScorecard> {
        try {
            return await TournamentScorecardSchema.findOneAndUpdate(
                {
                    _id: scorecardID,
                    userId: userID
                },
                {
                    $set: {
                        scores: scores
                    }
                },
                {
                    new: true
                }
            ).populate({
                path: "course"
            }).exec();
        } catch (error) {
            Logger.error(`Could not update scores - tournament scorecard ${scorecardID}. Error: ${error}`);
            throw error;
        }
    }


    public async update(tournamentScorecard: TournamentScorecard): Promise<TournamentScorecard> {
        try {
            return await TournamentScorecardSchema.findOneAndUpdate(
                {
                    _id: tournamentScorecard._id,
                    userId: tournamentScorecard.userId
                },
                {
                    $set: {
                        scores: tournamentScorecard.scores
                    }
                },
                {
                    new: true
                }
            ).exec();
        } catch (error) {
            Logger.error(`Could not update tournament scorecard ${tournamentScorecard._id}. Error: ${error}`);
            throw error;
        }
    }

    public async search(inputQuery: string, limit: number): Promise<TournamentScorecard[]> {
        throw new Error("Not implemented.");
    }

    public async updateAny(tournamentScorecard: TournamentScorecard): Promise<TournamentScorecard> {
        try {

            return await TournamentScorecardSchema.findOneAndUpdate(
                {
                    _id: tournamentScorecard._id,
                    userId: tournamentScorecard.userId
                },
                {
                    $set: tournamentScorecard
                },
                {
                    new: true
                }
            ).exec();
        } catch (error) {
            Logger.error(`Could not update tournament scorecard ${tournamentScorecard._id}. Error: ${error}`);
            throw error;
        }
    }
    

}
