import { Logger } from "../../core/logging";
import { MongoDAO } from "../../core/dao/mongo/mongo.dao";
import { Tournament } from "../../types/tournament";
import { TournamentDAO } from "../tournament.dao.interface";
import { TournamentSchema } from "../../models/tournament.model";
import * as moment from "moment";
import { ObjectId } from "mongodb";
import { GolfClubSchema } from "../../models/golf-club.model";

export class TournamentMongoDAO extends MongoDAO<Tournament> implements TournamentDAO {

    constructor() {
        super(TournamentSchema);
    }

    public async getTournament(tournamentId: string): Promise<Tournament> {
        try {
            return TournamentSchema
                .findById(tournamentId)
                .populate("courses.course", ["name", "tees"])
                //.populate("courses.course", ["name", "tees.name", "tees.gender"])
                .exec();
        } catch (error) {
            Logger.error(`Could not get tournament ${tournamentId}. Error: ${error}`);
            throw error;
        }
    }

    public async getAvailableTournaments(): Promise<Tournament[]> {
        const now = moment.utc().toDate();
        try {
            let tournaments = await TournamentSchema
                .find(/* {
                    regStartDate: {
                        $lte: now
                    },
                    endDate: {
                        $gte: now
                    }
                } */).sort('startDate')
                .populate("courses.course", ["name", "tees.name", "tees.gender","clubId"])
                .exec();
                //console.log('tournament ::',tournaments);
                /* for(let i=0;i<tournaments.length; i++) {
                    let tour = tournaments[i];
                    for(let j=0;j<tour.courses.length;j++) {
                        let course = tour.courses[j].course;
                        let clubDetails:any = await GolfClubSchema.findById(course.clubId).exec();
                        course['clubName'] = clubDetails?.name;
                    }
                } */
                return tournaments;
        } catch (error) {
            Logger.error(`Could not get all available tournaments. Error: ${error}`);
            throw error;
        }
    }

    public async markTournamentAsProcessed(tournamentID: string): Promise<void> {
        try {

            await TournamentSchema.findByIdAndUpdate(tournamentID,
                {
                    $set: {
                        isResultProcessed: true
                    }
                }
            ).exec();
        } catch (error) {
            Logger.error(`Could not mark tournament=${tournamentID} as processed. Error: ${error}`);
            throw error;
        }
    }


    public async update(tournament: Tournament): Promise<Tournament> {
        try {
            return TournamentSchema.findByIdAndUpdate(tournament._id,
                {
                    $set: tournament
                }
            ).exec();
        } catch (error) {
            Logger.error(`Could not update tournament=${tournament._id}. Error: ${error}`);
            throw error;
        }
    }

    public async search(inputQuery: string, limit: number): Promise<Tournament[]> {
        throw new Error("Not implemented.");
    }

}
