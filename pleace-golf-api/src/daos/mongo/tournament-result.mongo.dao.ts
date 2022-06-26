import { Logger } from "../../core/logging";
import { MongoDAO } from "../../core/dao/mongo/mongo.dao";
import { TournamentResult } from "../../types/tournament-result";
import { TournamentResultDAO } from "../tournament-result.dao.interface";
import { TournamentResultSchema } from "../../models/tournament-result.model";
import { GolfDivision } from "../../types/golf-division.enum";
import { Ranking } from "../../types/ranking";
import { Tournament } from "../../types/tournament";

export class TournamentResultMongoDAO extends MongoDAO<TournamentResult> implements TournamentResultDAO {

    constructor() {
        super(TournamentResultSchema);
    }

    public async getRanking(countryCodes: string[], division: GolfDivision): Promise<Ranking[]> {
        Logger.info(countryCodes);
        try {
            return TournamentResultSchema.aggregate([
                {
                    "$lookup": {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    "$match": {
                        "user.countryOfResidence": {
                            "$in": countryCodes
                        },
                        "division": {$regex: division, $options: "i"}
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "userId": "$user._id",
                        },
                        "roundTotal": { "$sum": "$total" },
                        "points": { "$sum": "$points" },
                        "bonusPoints": { "$sum": "$bonusPoints" },
                        "totalPoints": { "$sum": { '$add' : [ '$points', '$bonusPoints' ] }},
                        "resultCount": { "$sum": 1 },
                        "rounds": { "$sum": 1 },
                        "user": {
                            "$first": "$user"
                        }
                    }
                },
                {
                    "$sort": {
                        "roundTotal": -1
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "roundTotal": 1,
                        "totalPoints": { $round: [ "$totalPoints", 1 ] },
                        "points": 1,
                        "bonusPoints": 1,
                        "rounds" : 1,
                        "user": {
                            $arrayElemAt: [
                                '$user',
                                0
                            ]
                        }
                    }
                },
                {
                    "$project": {
                        "totalPoints" : "$totalPoints",
                        "roundTotal": "$roundTotal",
                        "rounds" : "$rounds",
                        "user": {
                            "_id": "$user._id",
                            "nationality": "$user.nationality",
                            "firstName": "$user.firstName",
                            "lastName": "$user.lastName"
                        }
                    }
                }
            ]).exec();
        } catch (error) {
            Logger.error(`Could not get ranking data. Error: ${error}`);
            throw error;
        }
    }

    public async getTournamentResults(tournamentId: string, division: GolfDivision): Promise<TournamentResult[]> {
        try {
            return TournamentResultSchema
                .find({
                    tournament: Tournament.fromId(tournamentId)
                    /* , division: division */
                })
                .sort({
                    total: -1
                })
                .populate("user", ["firstName", "lastName", "nationality", "homeClub"])
                .populate("tournament", ["name", "startDate", "endDate"])
                .exec();
        } catch (error) {
            Logger.error(`Could not get all tournament results. Error: ${error}`);
            throw error;
        }
    }

    public async getAllTournamentResults(division: GolfDivision): Promise<TournamentResult[]> {
        try {
            return TournamentResultSchema
                .find({
                    division: division
                })
                .populate("user", ["firstName", "lastName", "nationality", "homeClub"])
                .populate("tournament", ["name", "startDate", "endDate"])
                .exec();
        } catch (error) {
            Logger.error(`Could not get all tournament results. Error: ${error}`);
            throw error;
        }
    }

    public async update(tournamentResult: TournamentResult): Promise<TournamentResult> {
        throw new Error("Not implemented.");
    }

    public async search(inputQuery: string, limit: number): Promise<TournamentResult[]> {
        throw new Error("Not implemented.");
    }

}
