import { Logger } from "../core/logging";
import { ErrorBuilder } from "../core/errors/error-builder";
import { ErrorType } from "../core/errors/error-type.enum";
import { ErrorMessage } from "../types/error-message.enum";
import { DAO } from "../core/dao/dao.interface";
import { GolfClub } from "../types/golf-club";
import { Tournament } from "../types/tournament";
import { TournamentEntry } from "../types/tournament-entry";
import { TournamentResult } from "../types/tournament-result";
import { TournamentScorecard } from "../types/tournament-scorecard";
import { Score } from "../types/score";
import { TournamentScorecardDAO } from "../daos/tournament-scorecard.dao.interface";
import { TournamentLeaderboardDAO } from "../daos/tournament-leaderboard.dao.interface";
import { TournamentLeaderboard } from "../types/tournament-leaderboard";
import * as _ from "lodash";
import { FilterBuilder } from "../core/dao/filter/filter-builder";
import { GreaterThanOrEqualFilter } from "../core/dao/filter/greater-than-or-equal.filter";
import { LessThanOrEqualFilter } from "../core/dao/filter/less-than-or-equal.filter";
import { User } from "../types/user";
import { TournamentResultDAO } from "../daos/tournament-result.dao.interface";
import { TournamentDAO } from "../daos/tournament.dao.interface";
import { GolfDivision } from "../types/golf-division.enum";
import { Ranking } from "../types/ranking";
import { GolfCourse } from "../types/golf-course";
import { Gender } from "../types/gender.enum";
import { GolfHole } from "../types/golf-hole";
import * as moment from "moment";
import { TournamentEntrySchema } from "../models/tournament-entry.model";
import { TournamentLeaderboardSchema } from "../models/tournament-leaderboard.model";
import { LatestRankSchema } from "../models/latest-rank.model";
import { Request } from "express";
import { GolfCourseSchema } from "../models/golf-course.model";
import { UserSchema } from "../models/user.model";
import * as rankPointFieldDtls from "../../rank-point-field-details.json";
import * as pointsTable from "../../celebrity-champ-ranking-points.json";
import { TournamentSchema } from "../models/tournament.model";

export class TournamentManagementService {

    private readonly tournamentDAO: TournamentDAO;
    private readonly tournamentEntryDAO: DAO<TournamentEntry>;
    private readonly tournamentResultDAO: TournamentResultDAO;
    private readonly tournamentScorecardDAO: TournamentScorecardDAO;
    private readonly tournamentLeaderboardDAO: TournamentLeaderboardDAO;

    public constructor(
        tournamentDAO: TournamentDAO,
        tournamentEntryDAO: DAO<TournamentEntry>,
        tournamentResultDAO: TournamentResultDAO,
        tournamentScorecardDAO: TournamentScorecardDAO,
        tournamentLeaderboardDAO: TournamentLeaderboardDAO,
    ) {
        this.tournamentDAO = tournamentDAO;
        this.tournamentEntryDAO = tournamentEntryDAO;
        this.tournamentResultDAO = tournamentResultDAO;
        this.tournamentScorecardDAO = tournamentScorecardDAO;
        this.tournamentLeaderboardDAO = tournamentLeaderboardDAO;
    }

    /**
     * Get Tournaments
     * @async
     * @returns {Promise<Tournament[]>} List of tournaments.
     */
    public async getTournaments(): Promise<Tournament[]> {
        try {
            const tournaments = await this.tournamentDAO.getAll();
            return Promise.resolve(tournaments);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Create Tournaments
     * @async
     * @returns {Promise<Tournament>} List of tournaments.
     */
    public async createTournament(req: Request): Promise<Tournament> {
        try {
            const tournamentForm = req.body as Tournament;
            tournamentForm['createdBy'] = req.user.sub;
            const tournaments = await this.tournamentDAO.create(tournamentForm);
            return Promise.resolve(tournaments);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Create Tournaments
     * @async
     * @returns {Promise<Tournament>} List of tournaments.
     */
    public async updateTournament(req: Request): Promise<Tournament> {
        try {
            const tournamentForm = req.body as Tournament;
            const tournaments = await this.tournamentDAO.update(tournamentForm);
            return Promise.resolve(tournaments);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get Available Tournaments
     * @async
     * @returns {Promise<Tournament[]>} List of available tournaments.
     */
    public async getAvailableTournaments(): Promise<Tournament[]> {
        try {
            const filters = new FilterBuilder()
                .addFilter("regStartDate", new GreaterThanOrEqualFilter(new Date()))
                .addFilter("regEndDate", new LessThanOrEqualFilter(new Date()))
                .addFilter("endDate", new LessThanOrEqualFilter(new Date()))
                .buildAll();

            const tournaments = await this.tournamentDAO.getAvailableTournaments();
            return Promise.resolve(tournaments);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get Finished Tournaments
     * @async
     * @returns {Promise<Tournament[]>} List of available tournaments.
     */
    public async getFinishedTournaments(isResultProcessed: boolean): Promise<Tournament[]> {
        try {
            const filters = new FilterBuilder()
                .addFilter("isResultProcessed", isResultProcessed)
                .addFilter("endDate", new LessThanOrEqualFilter(new Date(Date.now() - ( 3600 * 1000 * 24))))
                .buildAll();

            const tournaments = await this.tournamentDAO.getMultipleByFilters(filters);
            return Promise.resolve(tournaments);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get Finished Tournaments by division
     * @async
     * @returns {Promise<Tournament[]>} List of available tournaments.
     */
    public async getFinishedTournamentsByDivision(isResultProcessed: boolean, division: any): Promise<Tournament[]> {
        try {
            let filters;
            if (division === 'All') {
                filters = new FilterBuilder()
                    .addFilter("isResultProcessed", isResultProcessed)
                    .addFilter("endDate", new LessThanOrEqualFilter(new Date(Date.now() - ( 3600 * 1000 * 24))))
                    .buildAll();
            } else {
                filters = new FilterBuilder()
                    .addFilter("isResultProcessed", isResultProcessed)
                    .addFilter("endDate", new LessThanOrEqualFilter(new Date(Date.now() - ( 3600 * 1000 * 24))))
                    .addFilter("divisions", division)
                    .buildAll();
            }
            const tournaments = await this.tournamentDAO.getMultipleByFilters(filters);
            return Promise.resolve(tournaments);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get Tournament
     * @async
     * @returns {Promise<Tournament>} Tournament object.
     */
    public async getTournament(tournamentId: string): Promise<Tournament> {
        try {
            const tournament = await this.tournamentDAO.getTournament(tournamentId);
            return Promise.resolve(tournament);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Enter tournament
     * @async
     * @returns {Promise<TournamentEntry>} Tournament Entry
     */
    public async enterTournament(userID: string, tournamentID: string, courseID: string, division: GolfDivision, gender: Gender, handicapIndex: number, tee: string,teamName?:string,accessToken?:string): Promise<TournamentEntry> {
        try {

            let tournament = await this.tournamentDAO.getTournament(tournamentID);
            /* const entriesCount = await TournamentEntrySchema.find({tournamentId:tournament._id}).count();
            if(entriesCount > 3) {
                tournament = await this.createNewTournament(tournament);
                tournamentID = tournament._id;
            } */
            // Validate tournament ID
           
            if (!tournament) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Range, ErrorMessage.InvalidTournamentId));
            }

            // Validate course ID
            /* const courseIds = _.map(tournament.courses, (tournamentGolfCourse) => {
                return tournamentGolfCourse.course._id.toString();
            });
            if (!_.includes(courseIds, courseID.toString())) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Range, ErrorMessage.InvalidCourseId));
            } */

            // Validate division
            if (!_.includes(Object.values(tournament.divisions), division.toString())) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Range, ErrorMessage.InvalidTournamentDivision));
            }

            // Validate entry
            const existingTournamentEntry = await this.tournamentEntryDAO.getByFilters(
                new FilterBuilder()
                    .addFilter("userId", userID)
                    .addFilter("tournamentId", tournamentID)
                    .addFilter("courseId", courseID)
                    .buildAll()
            );

            if (existingTournamentEntry) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Exists, ErrorMessage.TournamentEntryExists));
            }

            /* const enteredCourse = _.find(tournament.courses, (tournamentGolfCourse) => {
                return tournamentGolfCourse.course._id == courseID;
            }); */
            const enteredCourse: any = await GolfCourseSchema.findById(courseID).exec();
            //console.log('renter',enteredCourse);
            const enteredTee = _.find(enteredCourse.tees, (golfTee) => {
                return golfTee._id == tee;
            });

            const courseRating = Number(enteredTee.courseRating);
            const slopeRating = Number(enteredTee.slopeRating);
            const par = Number(enteredTee.par);
            const holes = enteredTee.holes;

            //Course Handicap = (Handicap Index * Slope Rating / 113) + (CR - Par)
            const courseIndex = Math.round((Number(handicapIndex) * slopeRating / 113) + (courseRating - par));

            // Create empty scorecard
            const tournamentScorecard = {
                userId: userID,
                tournamentId: tournamentID,
                course: GolfCourse.fromId(courseID),
                division: division,
                handicapIndex: handicapIndex,
                courseIndex: courseIndex,
                tee: enteredTee.name,
                //gender: gender,
                teeId: enteredTee._id,
                gender: enteredTee.gender,
                teamName : teamName ? teamName : undefined
            } as TournamentScorecard;

            const storedScorecard = await this.tournamentScorecardDAO.create(tournamentScorecard);

            // Create empty leaderboard record
            const tournamentLeaderboard = {
                user: User.fromId(userID),
                tournamentId: tournamentID,
                courseId: courseID,
                division: division,
                total: courseIndex,
                holes: 0,
                round1: 0,
                teamName : teamName ? teamName : undefined
            } as TournamentLeaderboard;

            const storedLeaderboard = await this.tournamentLeaderboardDAO.create(tournamentLeaderboard);

            // Tournament entry
            const tournamentEntry = {
                userId: userID,
                tournamentId: tournamentID,
                courseId: courseID,
                scorecardId: storedScorecard._id,
                leaderboardId: storedLeaderboard._id,
                division: division,
                handicapIndex: handicapIndex,
                tee: enteredTee.name,
                gender: gender,
                teamName : teamName ? teamName : undefined
            } as TournamentEntry;

            const storedTournamentEntry = await this.tournamentEntryDAO.create(tournamentEntry);

            if(accessToken) {
                let user = await UserSchema.findById(userID);
                const tokenIndex = user.amateurTokens.findIndex(o => o.includes(accessToken));
                if(tokenIndex > -1) { 
                    user.amateurTokens.splice(tokenIndex, 1);
                    await UserSchema.findOneAndUpdate(
                        {
                            _id: user._id
                        },
                        {
                            $set: {amateurTokens : user.amateurTokens}
                        },
                        {
                            new: true
                        }
                    ).exec();
                }
            }

            return Promise.resolve(storedTournamentEntry);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    //Check tournament entry if greater than 50 then create new tournament with tournamemnt name - 1,2,3...
    private async createNewTournament(tournament: Tournament) {
        /* const entriesCount = await TournamentEntrySchema.find({tournamentId:tournament._id}).count();
        console.log('entries Count',entriesCount);
        if(entriesCount > 3) { */
           
            let tournamentName = tournament['name'];
            const arr = tournamentName.split(' - ');
            let newName = '';
            if(arr.length > 1) {
                const num = Number(arr[1]) + 1;
                newName = tournament['name'] + ' - '+num;
            } else {
                newName = tournament['name'] + ' - '+1;
            }
            const checkNewTournament = await TournamentSchema.findOne({'name' : newName}).exec();
            if(checkNewTournament) {
                return checkNewTournament;
            } else {
                let newTournament:any = {};
                newTournament.name = newName;
                newTournament.regStartDate = tournament.regStartDate;
                newTournament.regEndDate = tournament.regEndDate;
                newTournament.startDate = tournament.startDate;
                newTournament.endDate   = tournament.endDate;
                newTournament.divisions   = tournament.divisions;
                newTournament.maxPlayers = tournament.maxPlayers;
                newTournament.challengers = tournament.challengers;
                newTournament.courses = tournament.courses;
                newTournament.type = tournament.type;
                //console.log('newTournament>>',newTournament);
                return await this.tournamentDAO.create(newTournament);
            }
            //return newTournament;
        /* } else {
            return tournament;
        } */
    }


    /**
     * Enter tournament
     * @async
     * @returns {Promise<TournamentEntry>} Tournament Entry
     */
    public async updateTournamentEntry(userID: string, tournamentID: string, courseID: string, division: GolfDivision, gender: Gender, handicapIndex: number, tee: string,teamName?:string): Promise<TournamentEntry> {
        try {

            const tournament = await this.tournamentDAO.getTournament(tournamentID);
            // Validate tournament ID
            if (!tournament) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Range, ErrorMessage.InvalidTournamentId));
            }

            // Validate course ID
            /*  const courseIds = _.map(tournament.courses, (tournamentGolfCourse) => {
                 return tournamentGolfCourse.course._id.toString();
             });
             if (!_.includes(courseIds, courseID.toString())) {
                 return Promise.reject(ErrorBuilder.generate(ErrorType.Range, ErrorMessage.InvalidCourseId));
             } */

            // Validate division
            if (!_.includes(Object.values(tournament.divisions), division.toString())) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Range, ErrorMessage.InvalidTournamentDivision));
            }

            // Validate entry
            const existingTournamentEntry: TournamentEntry = await this.tournamentEntryDAO.getByFilters(
                new FilterBuilder()
                    .addFilter("userId", userID)
                    .addFilter("tournamentId", tournamentID)
                    .buildAll()
            );

            if (!existingTournamentEntry) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.TournamentEntryNotExists));
            }

            /*  const enteredCourse = _.find(tournament.courses, (tournamentGolfCourse) => {
                 return tournamentGolfCourse.course._id == courseID;
             }); */
            const enteredCourse: any = await GolfCourseSchema.findById(courseID).exec();

            const enteredTee = _.find(enteredCourse.tees, (golfTee) => {
                return golfTee._id == tee;
            });

            const courseRating = Number(enteredTee.courseRating);
            const slopeRating = Number(enteredTee.slopeRating);
            const par = Number(enteredTee.par);
            const holes = enteredTee.holes;

            //Course Handicap = (Handicap Index * Slope Rating / 113) + (CR - Par)
            const courseIndex = Math.round((Number(handicapIndex) * slopeRating / 113) + (courseRating - par));

            let storedScorecard: TournamentScorecard = await this.tournamentScorecardDAO.getByID(existingTournamentEntry.scorecardId);

            storedScorecard['course'] = GolfCourse.fromId(courseID);
            storedScorecard['handicapIndex'] = handicapIndex;
            storedScorecard['courseIndex'] = courseIndex;
            storedScorecard['tee'] = enteredTee.name;
            storedScorecard['teeId'] = enteredTee._id;
            storedScorecard['teamName'] = teamName ? teamName : undefined;
            await this.tournamentScorecardDAO.updateAny(storedScorecard);
            console.log('udpate scrorecard:::', storedScorecard);


            const storedLeaderboard: TournamentLeaderboard = await this.tournamentLeaderboardDAO.getByID(existingTournamentEntry.leaderboardId);
            storedLeaderboard['courseId'] = courseID;
            storedLeaderboard['total'] = courseIndex;
            storedLeaderboard['teamName'] = teamName ? teamName : undefined;

            await TournamentLeaderboardSchema.findOneAndUpdate({
                _id: storedLeaderboard._id,
                user: storedLeaderboard.user
            },
                {
                    $set: storedLeaderboard
                },
                {
                    new: true
                }
            ).exec();

            existingTournamentEntry['courseId'] = courseID;
            existingTournamentEntry['handicapIndex'] = handicapIndex;
            existingTournamentEntry['tee'] = enteredTee.name;
            existingTournamentEntry['teamName'] = teamName ? teamName : undefined;

            await TournamentEntrySchema.findOneAndUpdate({
                _id: existingTournamentEntry._id,
                userId: existingTournamentEntry.userId
            },
                {
                    $set: existingTournamentEntry
                },
                {
                    new: true
                }
            ).exec();

            //await this.tournamentEntryDAO.update(existingTournamentEntry);

            console.log('udpate existingTournamentEntry:::', existingTournamentEntry);

            return Promise.resolve(existingTournamentEntry);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get user's tournament scorecard
     * @async
     * @returns {Promise<TournamentScorecard>} Tournament scorecard.
     */
    public async getScorecard(userID: string, scorecardID: string): Promise<TournamentScorecard> {
        try {

            const filters = new FilterBuilder()
                .addFilter("_id", scorecardID)
                .addFilter("userId", userID)
                .buildAll();

            const tournamentScorecard = await this.tournamentScorecardDAO.getByFilters(filters);

            if (!tournamentScorecard) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.InvalidScorecardId));
            }

            return Promise.resolve(tournamentScorecard);

        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get user's tournament scorecard
     * @async
     * @returns {Promise<TournamentScorecard>} Tournament scorecard.
     */
    public async getPlayerScorecard(userID: string, tournamentID: string): Promise<TournamentScorecard> {
        try {

            const tournamentScorecard = await this.tournamentScorecardDAO.getPlayerScorecard(userID, tournamentID);
            if (!tournamentScorecard) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.InvalidScorecardId));
            }
            return Promise.resolve(tournamentScorecard);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get user's tournament scorecard
     * @async
     * @returns {Promise<TournamentScorecard>} Tournament scorecard.
     */
    public async getScorecardAndCourseData(userID: string, scorecardID: string): Promise<TournamentScorecard> {
        try {
            const tournamentScorecard = await this.tournamentScorecardDAO.getScorecard(userID, scorecardID);

            if (!tournamentScorecard) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.InvalidScorecardId));
            }

            return Promise.resolve(tournamentScorecard);

        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Update scorecard
     * @async
     * @returns {Promise<TournamentScorecard>} Updated tournament scorecard.
     */
    public async updateScorecard(userID: string, scorecardID: string, scores: Score[]): Promise<TournamentScorecard> {
        try {
            // Validate scorecard ID
            const tournamentScorecard = await this.tournamentScorecardDAO.getScorecard(userID, scorecardID);

            if (!tournamentScorecard) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.InvalidScorecardId));
            }

            // Update scorecard
            const updatedTournamentScorecard = await this.tournamentScorecardDAO.updateScores(userID, scorecardID, scores);

            let enteredTee = _.find(tournamentScorecard.course.tees, (golfTee) => {
                return golfTee._id === tournamentScorecard.teeId;
            });
            if (!enteredTee) {
                enteredTee = _.find(tournamentScorecard.course.tees, (golfTee) => {
                    return golfTee.name === tournamentScorecard.tee && golfTee.gender === tournamentScorecard.gender;
                });
            }
            if (!enteredTee) {
                enteredTee = tournamentScorecard.course.tees[0];
            }
            const courseRating = Number(enteredTee.courseRating);
            const slopeRating = Number(enteredTee.slopeRating);
            const par = Number(enteredTee.par);
            const holes = enteredTee.holes;

            //Course Handicap = (Handicap Index * Slope Rating / 113) + (CR - Par)
            const courseIndex = Math.round((Number(tournamentScorecard.handicapIndex) * slopeRating / 113) + (courseRating - par));
            const total = this.calculateTotal(scores, holes);
            let numberOfPlayedHoles = total.numberOfPlayedHoles;
            let totalPoints = total.totalPoints;
            let net = totalPoints + courseIndex;

            Logger.info(numberOfPlayedHoles);
            Logger.info(totalPoints);
            Logger.info(net);

            await this.tournamentLeaderboardDAO.updateLeaderboard(userID, tournamentScorecard.tournamentId, tournamentScorecard.course._id, net, numberOfPlayedHoles, net);

            return Promise.resolve(updatedTournamentScorecard);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }



    /**
     * Get tournament leaderboard
     * @async
     * @returns {Promise<TournamentLeaderboard[]>} Tournament leaderboard list.
     */
    public async getLeaderboard(userID: string, leaderboardID: string): Promise<TournamentLeaderboard[]> {
        try {
            const filters = new FilterBuilder()
                .addFilter("user", userID)
                .addFilter("_id", leaderboardID)
                .buildAll();
            const userTournamentLeaderboardRecord = await this.tournamentLeaderboardDAO.getByFilters(filters);
            if (userTournamentLeaderboardRecord) {
                const tournamentLeaderboard = await this.tournamentLeaderboardDAO.getLeaderboard(userTournamentLeaderboardRecord.tournamentId, userTournamentLeaderboardRecord.division);

                Logger.debug('tournamentLeaderboard');
                Logger.debug(tournamentLeaderboard);

                return Promise.resolve(tournamentLeaderboard);
            }
            else {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.InvalidLeaderboardId));
            }
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }


    /**
     * Get tournament leaderboard
     * @async
     * @returns {Promise<TournamentLeaderboard[]>} Tournament leaderboard list.
     */
    public async getTournamentLeaderboard(tournamentId: string): Promise<TournamentLeaderboard[]> {
        try {
            const tournamentLeaderboard = await this.tournamentLeaderboardDAO.getLeaderboard(tournamentId);
            //Logger.debug('tournamentLeaderboard');
            //Logger.debug(tournamentLeaderboard);
            return Promise.resolve(tournamentLeaderboard);

        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }


    /**
     * Get tournament entry
     * @async
     * @returns {Promise<TournamentEntry>} Tournament entry
     */
    public async getTournamentEntry(userID: string, tournamentId: string): Promise<TournamentEntry> {
        try {
            const filters = new FilterBuilder()
                .addFilter("userId", userID)
                .addFilter("tournamentId", tournamentId)
                .buildAll();

            const tournamentEntry = await this.tournamentEntryDAO.getByFilters(filters);

            if (!tournamentEntry) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.DoesNotExist, ErrorMessage.InvalidTournamentId));
            }

            return Promise.resolve(tournamentEntry);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get tournament entries
     * @async
     * @returns {Promise<TournamentEntry[]>} Tournament entry list.
     */
    public async getTournamentEntries(userID: string): Promise<TournamentEntry[]> {
        try {
            const filters = new FilterBuilder()
                .addFilter("userId", userID)
                .buildAll();

            const tournamentEntries = await this.tournamentEntryDAO.getMultipleByFilters(filters);
            return Promise.resolve(tournamentEntries);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Get active tournament entries
     * @async
     * @returns {Promise<TournamentEntry[]>} Tournament entry list.
     */
    public async getActiveTournamentEntries(userID: string): Promise<TournamentEntry[]> {
        try {
            const filters = new FilterBuilder()
                .addFilter("userId", userID)
                .addFilter("startDate", new GreaterThanOrEqualFilter(new Date()))
                .addFilter("endDate", new LessThanOrEqualFilter(new Date()))
                .buildAll();

            const tournamentEntries = await this.tournamentEntryDAO.getMultipleByFilters(filters);
            return Promise.resolve(tournamentEntries);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Create tournament result
     * @async
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async createTournamentResult(userID: string, tournamentID: string, courseID: string, division: GolfDivision, total: number, holes: number, round1: number): Promise<boolean> {
        try {
            const tournamentResult = {
                user: User.fromId(userID),
                tournament: Tournament.fromId(tournamentID),
                courseId: courseID,
                division: division,
                total: total,
                holes: holes,
                round1: round1
            } as TournamentResult;

            await this.tournamentResultDAO.create(tournamentResult);

            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
     * Create tournament results
     * @async
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async createTournamentResults(tournamentID: string): Promise<boolean> {
        try {
            Logger.info(`createTournamentResults.`);
            const tournament = await this.tournamentDAO.getByID(tournamentID);
            //const tournamentDivisions = ["CHAMP","CELEBRITY","PROFESSIONAL_GOLFER","PGA Pro"]; //tournament.divisions;
            let tournamentResults: TournamentResult[] = [];
            let leaderboardWithPoints = await this.calculatePlayersPoints(tournamentID);
            let playersPoints = leaderboardWithPoints.playersPoints;
            let tournamentLeaderboards = leaderboardWithPoints.leaderboards;
            const avgIndex = leaderboardWithPoints.avgIndex;
            //for (let tournamentDivision of tournamentDivisions) {

            // Get leaderboard
            /* const filters = new FilterBuilder()
                .addFilter("tournamentId", tournamentID)
                .addFilter("division", tournamentDivision)
                .buildAll();

            const tournamentLeaderboards:any = await this.getTournamentLeaderboards(filters); */
            //await this.tournamentLeaderboardDAO.getMultipleByFilters(filters);
            //console.log('playersPoints',playersPoints);
            //console.log('tournamentLeaderboards',tournamentLeaderboards);
            // Map tournament results
            const divisionTournamentResults = _.map(tournamentLeaderboards, (tournamentLeaderboard) => {
                const points = playersPoints.find(o => o.userId == tournamentLeaderboard.user)?.points;
                //console.log('points::',points);
                let isChallenge = tournament.type === 'Challenge' ? true : false;
                return {
                    user: tournamentLeaderboard.user,
                    tournament: Tournament.fromId(tournamentID),
                    courseId: tournamentLeaderboard.courseId,
                    division: tournamentLeaderboard.division,
                    total: tournamentLeaderboard.total,
                    holes: tournamentLeaderboard.holes,
                    round1: tournamentLeaderboard.round1,
                    points: !isChallenge ? points : 0,
                    bonusPoints: isChallenge ? points : 0,
                    avgIndex : avgIndex
                } as TournamentResult;
            });

            tournamentResults.push(...divisionTournamentResults);
            //}
            Logger.info(`${tournamentResults.length} tournament results created.`);
            await this.tournamentResultDAO.createMany(tournamentResults);

            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async calculatePlayersPoints(tournamentId) {
        const filters = new FilterBuilder()
            .addFilter("tournamentId", tournamentId)
            .addFilter("holes",new GreaterThanOrEqualFilter(1))
            .buildAll();

        const tournamentLeaderboards = await this.tournamentLeaderboardDAO.getMultipleByFilters(filters);
        //console.log('leaderboard::',tournamentLeaderboards);
        //tournamentLeaderboards.forEach(()=>{});
        const tournamentEntries = await this.tournamentEntryDAO.getMultipleByFilters(
            new FilterBuilder()
                .addFilter("tournamentId", tournamentId)
                .buildAll()
        );
        //console.log('tournamentEntries::',JSON.stringify(tournamentEntries));
        const fieldSize = tournamentEntries.length;
        if (fieldSize) {
            let fieldSizeMetaData = rankPointFieldDtls.find(o => o.fieldSize === fieldSize);
            console.log('fieldSizeMetaData:::', fieldSizeMetaData);
            let totalIndex = 0;
            tournamentEntries.forEach(entries => {
                totalIndex = totalIndex + entries.handicapIndex;
            });
            const avgIndex = totalIndex / fieldSize;
            console.log('avgIndex', avgIndex);
            let playerPoints = [];
            let sortedLeaderboard = tournamentLeaderboards.sort((a, b) => a.total < b.total ? 1 : -1)
            let rankedLeaderBoard = this.mapRanking(sortedLeaderboard, 'total').sort();
            //console.log('sorted',rankedLeaderBoard);
            for (let i = 0; i < rankedLeaderBoard.length; i++) {
                let playerLB = rankedLeaderBoard[i];
                //console.log('playerLB',playerLB);
                if (playerLB.division.toLowerCase() === GolfDivision.Celebrity.toLowerCase()
                    || playerLB.division.toLowerCase() === GolfDivision.PGAPro.toLowerCase()
                    || playerLB.division.toLowerCase() === GolfDivision.TourPlayer.toLowerCase()) {
                    const pointTB = pointsTable.CELEBRITY;
                    playerPoints.push(this.getCalcPoints(playerLB, pointTB, avgIndex, fieldSizeMetaData))
                } else {
                    const pointTB = pointsTable.CHAMP;
                    playerPoints.push(this.getCalcPoints(playerLB, pointTB, avgIndex, fieldSizeMetaData))
                }
            }
            //console.log('playersPoints',playerPoints);
            let leaderboardWithPoints = {
                "playersPoints": playerPoints,
                "leaderboards": rankedLeaderBoard,
                "avgIndex" : avgIndex
            }
            return Promise.resolve(leaderboardWithPoints);
        } else {
            let leaderboardWithPoints = {
                "playersPoints": [],
                "leaderboards": tournamentLeaderboards,
                "avgIndex" : 0
            }
            return leaderboardWithPoints;
        }
    }

    mapRanking(array, key) {
        let rank = 1;
        for (let i = 0; i < array.length; i++) {
            let obj = array[i];
            let tie = false;
            if (i !== 0) {
                if (obj[key] !== array[i - 1][key]) {
                    rank = i + 1;
                    tie = false;
                } else {
                    tie = true;
                }
            }
            if (i < array.length - 1 && obj[key] == array[i + 1][key]) {
                tie = true;
            }
            if (tie) {
                obj['rank'] = 'T' + rank;
            } else {
                obj['rank'] = rank;
            }
        }
        return array;
    }

    getCalcPoints(playerLB, pointsTable, avgIndex, fieldSizeMetaData) {
        let pointColumn;
        for (let j = 0; j < pointsTable.length; j++) {
            let column = pointsTable[j];
            if (j === 0) {
                if (avgIndex <= column.endAvgIndex
                    || playerLB.division.toLowerCase() === GolfDivision.PGAPro.toLowerCase()
                    || playerLB.division.toLowerCase() === GolfDivision.TourPlayer.toLowerCase()) {
                    pointColumn = column;
                    break;
                }
            } else if (avgIndex >= column.startAvgIndex && avgIndex <= column.endAvgIndex) {
                pointColumn = column;
                break;
            }
        }
        let position = playerLB.rank;
        //check position above cut
        if (isNaN(position) && position.includes('T')) {
            position = position.split('T')[1];
        }
        console.log('division::', playerLB.division);

        //console.log(playerLB.user+' points',pointColumn);
        if (Number(position) <= fieldSizeMetaData.cut) {
            const points = pointColumn.points_position.find(o => o.position == position).points / fieldSizeMetaData.divisor;
            let playerPoints = { userId: playerLB.user, points: Math.round(points * 10)/10 };
            console.log('playerpoints', playerPoints);
            return playerPoints;
        } else {
            return { userId: playerLB.user, points: 0 };
        }
    }

    /**
     * Mark tournament as processed
     * @async
     * @returns {Promise<boolean>} Whether the operation succeeded.
     */
    public async markTournamentAsProcessed(tournamentID: string): Promise<boolean> {
        try {
            await this.tournamentDAO.markTournamentAsProcessed(tournamentID);

            return Promise.resolve(true);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }


    /**
     * Get tournament results
     * @async
     * @returns {Promise<TournamentResult[]>} Tournament result list
     */
    public async getTournamentResults(tournamentID: string, division: GolfDivision): Promise<TournamentResult[]> {
        try {
            const tournamentResults = await this.tournamentResultDAO.getTournamentResults(tournamentID, division);

            return Promise.resolve(tournamentResults);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
    * Get ranking
    * @async
    * @returns {Promise<Ranking[]>} Ranking list
    */
    public async getRanking(countryCodes: string[], division: GolfDivision): Promise<Ranking[]> {
        try {
            const rankings: any = await this.tournamentResultDAO.getRanking(countryCodes, division);
            return Promise.resolve(rankings);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
    * Get ranking
    * @async
    * @returns {Promise<any>} Ranking list
    */
    public async getUsersWithNoPoints(countryCodes: string[], division: GolfDivision, userWithPoints: any): Promise<any> {
        try {
            const userWithNoPoints: any = await UserSchema.find(
                {
                   
                    _id: { $nin: userWithPoints },
                    division: division,
                    //countryOfResidence: { $in: countryCodes },
                    $or: [
                        { countryOfResidence: { $in: countryCodes } },
                        { state: { $in: countryCodes } }
                    ],
                    isAdmin: false
                },
                { firstName: 1, lastName: 1, nationality: 1 }
            ).exec();
            return Promise.resolve(userWithNoPoints);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getStaticLatestRank(countryCodes: string[], division: GolfDivision) {
        try {
            const existingRank: any = await LatestRankSchema.find({
                division: division,
                nationality: { $in: countryCodes }
            }).exec();
            return Promise.resolve(existingRank);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /**
    * Get individual ranking
    * @async
    * @returns {Promise<Number>} Ranking (null if no ranking)
    */
    public async getIndividualRanking(userId: string, countryCodes: string[], division: GolfDivision): Promise<Number> {
        try {
            const rankings = await this.tournamentResultDAO.getRanking(countryCodes, division);
            const index = _.findIndex(rankings, function (ranking) { return ranking.user._id == userId; });

            let position = null;
            if (index !== -1) {
                position = index + 1;
            }

            return Promise.resolve(position);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    private calculateTotal(scores: Score[], holes: GolfHole[]) {
        const numberOfHoles = holes.length;
        let numberOfPlayedHoles = 0;
        let totalPoints = 0;

        for (let i = 1; i < numberOfHoles + 1; i++) {

            const foundScore = _.find(scores, (score) => {
                return score.hole === i;
            });

            const foundPar = _.find(holes, (hole) => {
                return hole.hole === i;
            });

            if (foundScore) {
                numberOfPlayedHoles++;

                const points = foundScore.points;//this.getPoints(foundScore.score, foundPar.par, i, numberOfHoles);
                totalPoints += points; //.points;
            }
        }

        return {
            numberOfPlayedHoles: numberOfPlayedHoles,
            totalPoints: totalPoints
        }
    }

    private getStrokePoint(points: number, description: string) {
        return {
            points: points,
            description: description
        }
    }

    private getPoints(strokes: number, par: number, hole: number, numberOfHoles: number) {

        // No change
        let pointMultiplier = 1;

        // Double points for last 3 holes
        if (hole === numberOfHoles || hole === (numberOfHoles - 1) || hole === (numberOfHoles - 2)) {
            pointMultiplier = 2;
        }

        if (strokes === null || par === null) {
            return null;
        }

        const toPar = Number(strokes) - Number(par);

        if (toPar >= 2) {
            return this.getStrokePoint(-3 * pointMultiplier, "Double Bogey +");
        }
        else if (toPar === 1) {
            return this.getStrokePoint(-1 * pointMultiplier, "Bogey");
        }
        else if (toPar === 0) {
            return this.getStrokePoint(0, "PAR");
        }
        else if (toPar === -1) {
            return this.getStrokePoint(2 * pointMultiplier, "Birdie");
        }
        else if (toPar === -2) {
            if (Number(par) === 3) {
                return this.getStrokePoint(7 * pointMultiplier, "Hole-In-One");
            }
            else {
                return this.getStrokePoint(5 * pointMultiplier, "Eagle");
            }
        }
        else if (toPar <= -3) {
            return this.getStrokePoint(9 * pointMultiplier, "Albatross");
        }
    }
}
