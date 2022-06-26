import { Request, Response } from "express";
import { InviteSchema } from "../models/invite.model";
import { CategorySchema } from "../models/category.model";
import { Logger } from "../core/logging";
import { UserSchema } from "../models/user.model";
import * as crypto from "crypto";
import { ErrorMessage } from "../types/error-message.enum";
import config from '../config';
import { GolfCourseDAO } from "../daos/golf-course.dao.interface";
import { ErrorBuilder } from "../core/errors/error-builder";
import { ErrorType } from "../core/errors/error-type.enum";
import { GolfCourseSchema } from "../models/golf-course.model";
import { GolfClubSchema } from "../models/golf-club.model";
import { TournamentLeaderboardSchema } from "../models/tournament-leaderboard.model";
import { TournamentResultSchema } from "../models/tournament-result.model";
import { ObjectId } from "mongodb";
import { stubFalse } from "lodash";
import { CelebrityTypeSchema } from "../models/Celebrity-type.model";
import { Job } from "../jobs/job.enum";
import { IJobScheduler } from "../core/jobs/job-scheduler.interface";
import { TournamentSchema } from "../models/tournament.model";
import { TournamentEntrySchema } from "../models/tournament-entry.model";
import { TournamentScorecardSchema } from "../models/tournament-scorecard.model";
import { LatestRankSchema } from "../models/latest-rank.model";


export class CommonService {


    private readonly golfCourseDAO: GolfCourseDAO;
    private readonly jobScheduler: IJobScheduler;

    public constructor(golfCourseDAO: GolfCourseDAO, jobScheduler: IJobScheduler) {
        this.golfCourseDAO = golfCourseDAO;
        this.jobScheduler = jobScheduler;
    }


    public async getCategories(req: Request, res: Response) {
        const categories = await CategorySchema.find({});
        res.status(200).send(categories);
    }

    public async createInvite(req: Request, res: Response) {
        try {
            const createInviteForm = req.body;
            const alreadyExistInvitee = await InviteSchema.find(
                {
                    firstName: { $regex: createInviteForm.firstName, $options: "i" },
                    country: createInviteForm.country,
                    type: createInviteForm.type
                }
            );
            if (alreadyExistInvitee?.length > 0) {
                return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, ErrorMessage.InviteeAlreadyExists));
            }
            const savedObj: any = await InviteSchema.create(createInviteForm);
            let inviteUrl = '';
            if (config.environment === "development") {
                inviteUrl = `${req.protocol}://${config.app.baseAddress}/register?id=${savedObj._id}`;
            } else {
                inviteUrl = `${req.protocol}://${req.hostname}/register?id=${savedObj._id}`;
            }
            InviteSchema.findByIdAndUpdate(savedObj._id, { url: inviteUrl }).exec();
            savedObj['url'] = inviteUrl;
            if (createInviteForm.isVerified) {
                res.status(200).send({ savedInvite: savedObj });
            } else {
                const userId = req.user.sub;
                const user = await UserSchema.findById(userId).exec();
                createInviteForm['requestedByName'] = user.firstName + ' ' + user.lastName;
                createInviteForm['requestedByEmail'] = user.email;
                createInviteForm['_id'] = savedObj._id;
                await this.jobScheduler.now(Job.CreateInviteeRequestJob, { user: createInviteForm });
                res.status(200).send({ successMsg: 'Invitee request sent successfully' });
                //res.status(200).send();
            }
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getInviteDetails(req: Request, res: Response) {
        try {
            const inviteDetails = await InviteSchema.findById(req.params.inviteId).exec();
            res.status(200).send(inviteDetails);
        } catch (error) {
            //return Promise.reject(ErrorBuilder.generate(ErrorType.InviteDoesNotExist, ErrorMessage.InvalidInvitationLink));
            let err = { errorCode: 404, errorMessage: ErrorMessage.InvalidInvitationLink };
            res.status(404).send(err);
        }
    }

    public async getCelebIndexRanking(req: Request, res: Response) {
        const celebrities = await UserSchema.find(
            { division: { $regex: 'Celebrity', $options: "i" }, isAdmin: false },
            { firstName: 1, lastName: 1, nationality: 1, handicapIndex: 1 }
        ).sort('handicapIndex').exec();
        res.status(200).send(celebrities);
    }

    public async invitationUsed(req: Request, res: Response) {
        try {
            await InviteSchema.findByIdAndUpdate(req.params.inviteId, { isUsed: true, usedBy: req.params.userId }).exec();
            res.status(200).send({ successMessage: 'Invitation updated successfully' });
        } catch (error) {
            //return Promise.reject(ErrorBuilder.generate(ErrorType.InviteDoesNotExist, ErrorMessage.InvalidInvitationLink));
            //let err = {errorCode:404,errorMessage:ErrorMessage.InvalidInvitationLink};
            res.status(500).send(error);
        }
    }

    public async invitationDeclined(req: Request, res: Response) {
        try {
            await InviteSchema.findByIdAndUpdate(req.params.inviteId, { isUsed: true, isDeclined: true }).exec();
            res.status(200).send({ successMessage: 'Invitation Declined successfully' });
        } catch (error) {
            //return Promise.reject(ErrorBuilder.generate(ErrorType.InviteDoesNotExist, ErrorMessage.InvalidInvitationLink));
            //let err = {errorCode:404,errorMessage:ErrorMessage.InvalidInvitationLink};
            res.status(500).send(error);
        }
    }

    public async verifyInvitee(req: Request) {
        try {
            const createInviteForm = req.body;
            const invitee = await InviteSchema.findByIdAndUpdate(req.params.inviteId, createInviteForm).exec();
            return Promise.resolve(invitee);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getAllGolfCourses() {
        try {
            const allGolfCourses = await this.golfCourseDAO.getAll();
            return Promise.resolve(allGolfCourses);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async findGolfCourses(searchStr: string) {
        try {
            //const allGolfCourses = await  GolfCourseSchema.find({name:{ "$regex": searchStr, "$options": "i" }});
            let allGolfCourses = await GolfCourseSchema.aggregate([
                {
                    "$lookup": {
                        from: 'golfclubs',
                        localField: 'clubId',
                        foreignField: '_id',
                        as: 'club'
                    }
                },
                {
                    "$match": {
                        "name": { "$regex": searchStr, "$options": "i" }
                    }
                }
            ]).exec();
            return Promise.resolve(allGolfCourses);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    /* public async getClubInfoById(id:string) {
        try {
            //const allGolfCourses = await this.golfCourseDAO.getByFilter({name:{ "$regex": searchStr, "$options": "i" }})
            const golfCulbInfo = await  GolfClubSchema.findById(id);//.find({name:{ "$regex": searchStr, "$options": "i" }});
            return Promise.resolve(golfCulbInfo);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    } */

    public async updateGolfCourse(req: Request) {
        try {
            let courseForm: any = req.body.courseInfo;
            const updatedCourse = await GolfCourseSchema.findOneAndUpdate({
                _id: courseForm._id
            },
                {
                    $set: courseForm
                },
                {
                    new: true
                }
            ).exec();

            let clubInfo: any = req.body.clubInfo;
            const updatedClub = await GolfClubSchema.findOneAndUpdate({
                _id: clubInfo._id
            },
                {
                    $set: clubInfo
                },
                {
                    new: true
                }
            ).exec();
            return Promise.resolve({ clubInfo: updatedClub, courseInfo: updatedCourse });
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getCourseScoreCard(courseId: string) {
        try {
            let scorecard = await TournamentResultSchema.aggregate([
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
                        "courseId": ObjectId(courseId)
                    }
                },
                {
                    $project: {
                        "user.password": 0,
                        "user.email": 0,
                        "user.status": 0,
                        "user.isConfirmed": 0,
                        "user.emailVerificationCode": 0,
                        "user.resetPasswordVerificationCode": 0,
                        "user.pgaMemberNumber": 0,
                        "user.isAdmin": 0,
                        "user.createdAt": 0,
                        "user.updatedAt": 0,
                        "user.invitation": 0
                    }
                }
            ]).exec();
            return Promise.resolve(scorecard);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async deleteGolfCourse(courseId: string) {
        try {
            const deletedCourse = await GolfCourseSchema.findOneAndUpdate({
                _id: courseId
            },
                {
                    $set: { status: false }
                },
                {
                    new: true
                }
            ).exec();
            return Promise.resolve(deletedCourse);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async deleteGolfClub(clubId: string) {
        try {
            //let clubInfo = await GolfClubSchema.findById(clubId);
            await GolfCourseSchema.deleteMany({clubId:ObjectId(clubId)});
            const deletedCourse = await GolfClubSchema.deleteOne({_id:ObjectId(clubId)});
            //this.jobScheduler.now(Job.GolfClubUpdatedNotificationJob, { clubInfo: clubInfo , 'operation' : 'delete'});
            return Promise.resolve(deletedCourse);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }
    
    public async getCourseInfoById(id: string) {
        try {
            //const golfCourseInfo = await  GolfCourseSchema.findById(id);
            let golfCourseInfo = await GolfCourseSchema.aggregate([
                {
                    "$lookup": {
                        from: 'golfclubs',
                        localField: 'clubId',
                        foreignField: '_id',
                        as: 'club'
                    }
                },
                {
                    "$match": {
                        "_id": ObjectId(id)
                    }
                }
            ]).exec();
            return Promise.resolve(golfCourseInfo[0]);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async findGolfClubs(searchStr: string, countryCode: string) {
        try {
            let findFilter;
            if (searchStr === 'all') { }
            if (countryCode !== 'all') {
                if (searchStr === '-9999') {
                    findFilter = {
                        countryCode: countryCode
                    };
                } else {
                    findFilter = {
                        name: { "$regex": searchStr, "$options": "i" },
                        countryCode: countryCode
                    };
                }
            } else {
                if (searchStr === '-9999') {
                    findFilter = {}
                } else {
                    findFilter = {
                        name: { "$regex": searchStr, "$options": "i" }
                    }
                }
            }
            findFilter['$or'] = [
                { status: { $exists: false } },
                { status: true }
            ]
            const golfClubs = await GolfClubSchema.find(findFilter);
            return Promise.resolve(golfClubs);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getClubInfoById(id: string) {
        try {
            //const golfCourseInfo = await  GolfCourseSchema.findById(id);
            let golfClubInfo = await GolfClubSchema.aggregate([
                {
                    "$lookup": {
                        from: 'golfcourses',
                        localField: '_id',
                        foreignField: 'clubId',
                        as: 'courses'
                    }
                },
                {
                    "$match": {
                        "_id": ObjectId(id)
                    }
                }
            ]).exec();
            return Promise.resolve(golfClubInfo[0]);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getAllInvitees(req: Request) {
        try {
            if (req.params?.from === 'adminPage') {
                const invitees = await InviteSchema.find().sort('firstName').exec();
                return Promise.resolve(invitees);
            } else {
                const invitees = await InviteSchema.find(
                    {
                        isUsed: false, isVerified: true,
                        $or: [
                            { isSpecialInvitee: { $exists: false } },
                            { isSpecialInvitee: false }
                        ]
                    }).sort('firstName').exec();
                return Promise.resolve(invitees);
            }
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getInviteesByCourtry(countryCode) {
        try {
            const invitees = await InviteSchema.find({ isUsed: false, isVerified: true, country: countryCode });
            return Promise.resolve(invitees);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getCelebrityTypes() {
        try {
            const celebTypes = await CelebrityTypeSchema.find({});
            return Promise.resolve(celebTypes);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async updateClubCourseDetails(req: Request) {
        try {
            
            let clubInfo: any = req.body.clubInfo;
            
            let courses = clubInfo.courses;
            let deletedCourses = clubInfo.deletedCourses;
            let clubHoles = 0;
            for (let i = 0; i < courses.length; i++) {
                let courseForm = courses[i];
                clubHoles = clubHoles + courseForm.numberOfHoles;
                //console.log('courseForm::::',courseForm);
                if (courseForm._id) {
                    await GolfCourseSchema.findOneAndUpdate(
                        {
                            _id: courseForm._id
                        },
                        {
                            $set: courseForm
                        },
                        {
                            new: true
                        }
                    ).exec();
                } else {
                    courseForm._id = this.hashIdTo12Characters(courseForm.code);
                    await GolfCourseSchema.create(courseForm);
                }
            }
            for (let i = 0; i < deletedCourses.length; i++) {
                let courseForm = deletedCourses[i];
                await GolfCourseSchema.deleteOne({_id:ObjectId(courseForm._id)});
            }
            clubInfo['numberOfHoles'] = clubHoles;
            const updatedClub = await GolfClubSchema.findOneAndUpdate({
                _id: clubInfo._id
            },
                {
                    $set: clubInfo
                },
                {
                    new: true
                }
            ).exec();
            //let clubDetails = Promise.resolve(updatedClub);
            //const actionBy = req.body.actionBy;
            //updatedClub['actionBy'] = actionBy;
            //this.jobScheduler.now(Job.GolfClubUpdatedNotificationJob, { clubInfo: updatedClub , 'operation' : 'update'});
            return Promise.resolve(updatedClub);;
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async notifySingleClub(req: Request) {
        try {
            this.jobScheduler.now(Job.NotifyClubsUpdateCourseJob, { clubInfo: [req.body] });
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async notifyAllClub(req: Request) {
        try {
            const golfClubsDb: any[] = await GolfClubSchema.find({ email: { $ne: 'N/D' } });
            let golfClubs = [];
            golfClubsDb.forEach(function (elm) {
                const club = {
                    subject: req.body.subject,
                    body: req.body.body,
                    clubId: elm._id,
                    clubName: elm.name,
                    clubEmail: elm.email,
                    countryCode: elm.countryCode
                }
                golfClubs.push(club);
            });
            this.jobScheduler.now(Job.NotifyClubsUpdateCourseJob, { clubInfo: golfClubs });
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getAllTournament() {
        try {
            const tournaments = await TournamentSchema.find({}).sort('startDate');
            return Promise.resolve(tournaments);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async deleteInvitee(id) {
        try {
            const deletedInvitee = await InviteSchema.deleteOne({ "_id": ObjectId(id) });
            return Promise.resolve(deletedInvitee);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getChallengers() {
        try {
            let challengersDb: any = await UserSchema.find({ isAdmin: false }, { firstName: 1, lastName: 1, nationality: 1, handicapIndex: 1, division: 1 });
            let challengers = []
            for (let i = 0; i < challengersDb?.length; i++) {
                let challenger = challengersDb[i];
                const invitee = await InviteSchema.find({ usedBy: challenger._id }).exec();
                let obj = {
                    _id: challenger._id,
                    firstName: challenger.firstName,
                    lastName: challenger.lastName,
                    nationality: challenger.nationality,
                    division: challenger.division
                }
                if (invitee?.length > 0) {
                    obj['type'] = invitee[0].type;
                    obj['stageName'] = invitee[0].stageName;
                }
                challengers.push(obj);
            }
            return Promise.resolve(challengers);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }


    public async getEnteredTournaments(req: Request) {
        try {
            const userId = req.params.userId;
            let enteredTournament: any = await TournamentEntrySchema.find({ userId: ObjectId(userId) }).exec();
            return Promise.resolve(enteredTournament);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }


    public async getTournamentEntries(req: Request) {
        try {
            const tournamentId = req.params.tournamentId;
            let tournamentEntries: any = await TournamentEntrySchema.find({ tournamentId: ObjectId(tournamentId) })
                .populate('userId', ['firstName', 'lastName', 'nationality', 'stageName', 'division']).exec();
            //console.log('tournamentEntries',tournamentEntries);
            return Promise.resolve(tournamentEntries);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async addChallengers(req: Request) {
        try {
            const tournamentId = req.params.tournamentId;
            let challengers = req.body.challengers;
            //const userId = req.user.sub;
            //challengers.push(userId);
            const updatedTournament = await TournamentSchema.findByIdAndUpdate(tournamentId, { challengers: challengers }).exec();
            return Promise.resolve(updatedTournament);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async deleteTournament(req: Request) {
        try {
            const tournamentId = req.params.tournamentId;
            await TournamentResultSchema.deleteMany({ tournament: ObjectId(tournamentId) });
            await TournamentLeaderboardSchema.deleteMany({ tournamentId: ObjectId(tournamentId) });
            await TournamentScorecardSchema.deleteMany({ tournamentId: ObjectId(tournamentId) });
            await TournamentEntrySchema.deleteMany({ tournamentId: ObjectId(tournamentId) });
            const deletedTour = await TournamentSchema.deleteOne({ _id: ObjectId(tournamentId) });
            return Promise.resolve(deletedTour);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async leaveTournament(req: Request) {
        try {
            const tournamentId = req.params.tournamentId;
            const userId = req.params.userId;
            const tournament = await TournamentSchema.findById(tournamentId);
            await TournamentResultSchema.deleteOne({ tournamentId: ObjectId(tournamentId), user: ObjectId(userId) });
            await TournamentLeaderboardSchema.deleteOne({ tournamentId: ObjectId(tournamentId), user: ObjectId(userId) });
            await TournamentScorecardSchema.deleteOne({ tournamentId: ObjectId(tournamentId), userId: ObjectId(userId) });
            await TournamentEntrySchema.deleteOne({ tournamentId: ObjectId(tournamentId), userId: ObjectId(userId) });
            const playerIndex = tournament.challengers.findIndex(o => o.includes(userId));
            if (playerIndex > -1) {
                tournament.challengers.splice(playerIndex, 1);
                const updatedTournament = await TournamentSchema.findOneAndUpdate(
                    {
                        _id: tournamentId
                    },
                    {
                        $set: tournament
                    },
                    {
                        new: true
                    }
                ).exec();
            }

            return Promise.resolve(tournament);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getAllPlayers() {
        try {
            const players = await UserSchema.find({ isAdmin: false },
                { firstName: 1, lastName: 1, nationality: 1, handicapIndex: 1, stageName: 1, division: 1 }
            ).sort('handicapIndex').exec();
            return Promise.resolve(players);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async deletePlayerByAdmin(req: Request) {
        try {
            const userId = req.params.userId;
            await TournamentResultSchema.deleteMany({ user: ObjectId(userId) });
            await TournamentLeaderboardSchema.deleteMany({ user: ObjectId(userId) });
            await TournamentScorecardSchema.deleteMany({ userId: ObjectId(userId) });
            await TournamentEntrySchema.deleteMany({ userId: ObjectId(userId) });
            let tournaments = await TournamentSchema.find();
            if (tournaments?.length > 0) {
                for (let i = 0; i < tournaments.length; i++) {
                    let tournament = tournaments[i];
                    const playerIndex = tournament.challengers?.findIndex(o => o.includes(userId));
                    if (playerIndex > -1) {
                        tournament.challengers.splice(playerIndex, 1);
                        const updatedTournament = await TournamentSchema.findOneAndUpdate(
                            {
                                _id: tournament._id
                            },
                            {
                                $set: tournament
                            },
                            {
                                new: true
                            }
                        ).exec();
                    }
                }
            }
            await LatestRankSchema.deleteOne({user:ObjectId(userId)});
            const deletedPlayer = await UserSchema.deleteOne({_id:ObjectId(userId)});
            return Promise.resolve(deletedPlayer);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async addGolfClub(req: Request) {
        try {
            let clubInfo: any = req.body.clubInfo;
            clubInfo._id = this.hashIdTo12Characters(clubInfo.code);
            const newClub = await GolfClubSchema.create(clubInfo);
            //this.jobScheduler.now(Job.GolfClubUpdatedNotificationJob, { clubInfo: newClub , 'operation' : 'add'});
            return Promise.resolve(newClub);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async needHelp(req: Request) {
        try {
            let needHelpForm: any = req.body;
            this.jobScheduler.now(Job.needHelpJob,needHelpForm);
            return Promise.resolve({ successMsg: 'Email is sent to admin' });
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }

    public async getAmateurTokens(userId) {
        try {
            let isSpecialInvitee = false;
            const tokens = await UserSchema.findById(userId,
                { amateurTokens: 1}
            ).exec();
            const invitee = await InviteSchema.find({usedBy:userId}).exec();
            if(invitee.length > 0) {
                isSpecialInvitee = true;
            }
            return Promise.resolve({tokens : tokens.amateurTokens, isSpecialInvitee : isSpecialInvitee});
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }


    private hashIdTo12Characters(id: string): string {
        const hash = crypto.createHash('sha256');
        hash.update(id);
        return hash.digest('hex').substring(0, 24);
    }

}