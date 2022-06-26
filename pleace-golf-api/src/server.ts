import { Application } from "express";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

import config from './config';
import { ApiRouter as ApiRouterV1 } from "./api/v1/routes";
import { App } from "./app";
import { Logger } from "./core/logging";
import { AuthenticationService } from "./services/authentication.service";
import { UserService } from "./services/user.service";
import { UserMongoDAO } from "./daos/mongo/user.mongo.dao";
import { AgendaDependency } from "./core/dependencies/agenda/agenda.dependency";
import { DataImporter } from "./data/data-importer";
import { CountryService } from "./core/country/country-service";
import { CountryCodeType } from "./core/country/country-code-type.enum";
import { TokenGenerator } from "./core/auth/token-generator";
import { AccessToken } from "./types/access-token";
import { BasicMongoDAO } from "./core/dao/mongo/basic-mongo.dao";
import { AccessTokenSchema } from "./models/access-token.model";
import { GolfCourse } from "./types/golf-course";
import { GolfCourseSchema } from "./models/golf-course.model";
import { GolfClub } from "./types/golf-club";
import { GolfClubSchema } from "./models/golf-club.model";
import { Tournament } from "./types/tournament";
import { TournamentSchema } from "./models/tournament.model";
import { GolfClubService } from "./services/golf-club.service";
import { TournamentManagementService } from "./services/tournament-management.service";
import { TournamentScorecardMongoDAO } from "./daos/mongo/tournament-scorecard.mongo.dao";
import { TournamentLeaderboardMongoDAO } from "./daos/mongo/tournament-leaderboard.mongo.dao";
import { TournamentResultMongoDAO } from "./daos/mongo/tournament-result.mongo.dao";
import { TournamentMongoDAO } from "./daos/mongo/tournament.mongo.dao";
import { TournamentEntry } from "./types/tournament-entry";
import { TournamentEntrySchema } from "./models/tournament-entry.model";
import { AgendaJobScheduler } from "./core/jobs/agenda/agenda.job-scheduler";
import { AgendaJobDataExtractor } from "./core/jobs/agenda/agenda.job-data-extractor";
import { UserEmailVerificationJobProcessor } from "./jobs/user-email-verification.job";
import { TournamentResultJobProcessor } from "./jobs/tournament-result.job";
import { Job } from "./jobs/job.enum";
import { SendgridEmailService } from "./core/email/sendgrid/sendgrid.email-service";
import { UserForgotPasswordRequestJobProcessor } from "./jobs/user-forgot-password-request.job";
import { GolfCourseMongoDAO } from "./daos/mongo/golf-course.mongo.dao";
import { DataTransformer } from "./data/data-transformer";
import { CommonService } from "./services/common.service";
import { SendinblueEmailService } from "./core/email/sendinblue.email-service";
import { CreateInviteeRequestJobProcessor } from "./jobs/create-invitee-request.job";
import { NotifyClubsUpdateCourseJobProcessor } from "./jobs/notify-clubs-update-course.job";
import { GolfClubUpdatedNotificationJobProcessor } from "./jobs/golf-club-updated-notification.job";
import { NeedHelpJobProcessor } from "./jobs/need-help-job";

export class Server {
    private server: https.Server | http.Server;
    private app: Application;
    private agendaDependency: AgendaDependency;

    public constructor(agendaDependency: AgendaDependency) {
        this.agendaDependency = agendaDependency;
    }

    public async init() {

        // Job Scheduler
        const agenda = await this.agendaDependency.getClient();
        const agendaJobScheduler = new AgendaJobScheduler(agenda);

        // DAOs
        const userMongoDAO = new UserMongoDAO();
        const golfClubMongoDAO = new BasicMongoDAO<GolfClub>(GolfClubSchema);
        const golfCourseMongoDAO = new GolfCourseMongoDAO();
        const accessTokenMongoDAO = new BasicMongoDAO<AccessToken>(AccessTokenSchema);
        const tournamentMongoDAO = new TournamentMongoDAO();
        const tournamentScorecardMongoDAO = new TournamentScorecardMongoDAO();
        const tournamentLeaderboardMongoDAO = new TournamentLeaderboardMongoDAO();
        const tournamentResultMongoDAO = new TournamentResultMongoDAO();
        const tournamentEntryMongoDAO = new BasicMongoDAO<TournamentEntry>(TournamentEntrySchema);

        // Services
        const countryService = new CountryService();
        const authService = new AuthenticationService();
        const userService = new UserService(userMongoDAO, accessTokenMongoDAO, agendaJobScheduler);
        const golfClubService = new GolfClubService(golfClubMongoDAO);
        const tournamentManagementService = new TournamentManagementService(tournamentMongoDAO, tournamentEntryMongoDAO, tournamentResultMongoDAO, tournamentScorecardMongoDAO, tournamentLeaderboardMongoDAO);
        const sendgridEmailService = new SendgridEmailService(config.email.sendgridApiKey, config.email.fromEmail, config.email.replyEmail);
        const sendinblueEmailService = new SendinblueEmailService(config.email.sendinblueApiKey, config.email.fromEmail, config.email.adminEmail);

        // Data Importer
        const dataImporter = new DataImporter(golfClubMongoDAO, golfCourseMongoDAO, accessTokenMongoDAO, tournamentMongoDAO, config.dataImportFilePath, countryService,config.dataImportFilePathNew);
        // Data Transformer
        const dataTransformer = new DataTransformer(golfClubMongoDAO, golfCourseMongoDAO, accessTokenMongoDAO, tournamentMongoDAO, config.dataTransformFilePath, countryService);
        //common service 
        const commonService = new CommonService(golfCourseMongoDAO,agendaJobScheduler);
        // Jobs
        const agendaJobDataExtractor = new AgendaJobDataExtractor();
        //const userEmailVerificationJob = new UserEmailVerificationJobProcessor(agendaJobDataExtractor, sendgridEmailService);
        const userEmailVerificationJob = new UserEmailVerificationJobProcessor(agendaJobDataExtractor, sendinblueEmailService);
        //const userForgotPasswordRequestJob = new UserForgotPasswordRequestJobProcessor(agendaJobDataExtractor, sendgridEmailService);
        const userForgotPasswordRequestJob = new UserForgotPasswordRequestJobProcessor(agendaJobDataExtractor, sendinblueEmailService);
        const createInviteeRequestJobProcessor = new CreateInviteeRequestJobProcessor(agendaJobDataExtractor, sendinblueEmailService);
        const notifyClubsUpdateCourseJobProcessor = new NotifyClubsUpdateCourseJobProcessor(agendaJobDataExtractor, sendinblueEmailService);
        const golfClubUpdatedNotificationJobProcessor = new GolfClubUpdatedNotificationJobProcessor(agendaJobDataExtractor, sendinblueEmailService);
        const needHelpJobProcessor = new NeedHelpJobProcessor(agendaJobDataExtractor, sendinblueEmailService);
        const tournamentResultJob = new TournamentResultJobProcessor(agendaJobDataExtractor, tournamentManagementService);

        // Register jobs
        this.agendaDependency.registerJobDefinitions(userEmailVerificationJob, userForgotPasswordRequestJob, tournamentResultJob,
            createInviteeRequestJobProcessor,notifyClubsUpdateCourseJobProcessor,
            needHelpJobProcessor);
        // Clean jobs
        await this.agendaDependency.removeUndefinedBehaviourJobs();
        // Start job queue processing
        await this.agendaDependency.start();

        // Schedule recurring jobs
        const schedulerOptions = { skipImmediate: true };
        
        await agendaJobScheduler.every('15 minutes', Job.TournamentResultJob, {}, schedulerOptions);
        //await agendaJobScheduler.every('2 minutes', 'UserEmailVerificationJob', {}, schedulerOptions);
        //await agendaJobScheduler.now("UserEmailVerificationJob");


        const routerV1 = new ApiRouterV1(authService, userService, countryService, golfClubService, tournamentManagementService, dataImporter, dataTransformer,commonService);
        const routersMap: { [version: string]: any } = {
            "": routerV1,
            "v1": routerV1,
        };

        this.app = (new App(routersMap, userService, this.agendaDependency)).getApp();

        this.app.set("port", config.api.port);

        if (config.https.isEnabled) {
            let options = {
                key: fs.readFileSync(config.https.keyPath),
                cert: fs.readFileSync(config.https.certPath)
            };

            this.server = https.createServer(options, this.app);
        }
        else{
            this.server = http.createServer(this.app);
        }
    }

    public start() {
        this.server.listen(config.api.port);
        this.server.on("error", (ex: Error) => { this.onError(ex); });
        this.server.on("listening", () => { this.onListening(); });
    }

    private onError(ex: Error): void {
        Logger.info('Error...');
        Logger.error(ex as any);
    }

    private onListening(): void {
        const addr = this.server.address();
        const bind = (typeof addr === "string") ? `${addr}` : `${addr.port}`;
        Logger.info(`API is listening on port: ${bind}`);
    }

    public getApp(): Application {
        return this.app;
    }
}
