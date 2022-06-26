import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import * as passport from "passport";
import { Logger } from "../../../core/logging";
import { wrapAsyncWithErrorHandling } from "../../handlers/error-handler";
import { Mapper } from "../mapper";
import { GolfClubService } from "../../../services/golf-club.service";
import { validate } from "../../../core/validation/validator";
import { GolfClubResponse } from "../dtos/response/golf-club.response";
import { TournamentManagementService } from "../../../services/tournament-management.service";
import { TournamentResponse, TournamentLeaderboardResponse, TournamentResultSummaryResponse, TournamentResultResponse } from "../dtos/response";
import { TournamentEntryRequestSchema } from "../dtos/request/tournament-entry.request";
import { EnterTournamentRequest, EnterTournamentRequestSchema } from "../dtos/request/enter-tournament.request";
import { TournamentScorecardRequestSchema } from "../dtos/request/tournament-scorecard.request";
import { SaveTournamentScorecardRequest, SaveTournamentScorecardRequestSchema } from "../dtos/request/save-tournament-scorecard.request";
import { TournamentLeaderboardRequestSchema } from "../dtos/request/tournament-leaderboard.request";
import { TournamentResultRequestSchema } from "../dtos/request/tournament-result.request";
import { UserService } from "../../../services/user.service";
import { GolfDivision } from "../../../types/golf-division.enum";
import { TournamentResultSummaryRequestSchema } from "../dtos/request/tournament-result-summary.request";
import { TournamentRequestSchema } from "../dtos/request/tournament.request";

export class TournamentController {
    private readonly tournamentManagementService: TournamentManagementService;
    private readonly userService: UserService;
    private router: Router;

    constructor(tournamentManagementService: TournamentManagementService, userService: UserService) {
        this.tournamentManagementService = tournamentManagementService;
        this.userService = userService;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = Router();
        //this.router.use(passport.authenticate("jwt", { session: false }));
        this.router.get("/", wrapAsyncWithErrorHandling(this.getTournaments, this));
        this.router.get("/all-tournaments", validate, wrapAsyncWithErrorHandling(this.getAllTournaments, this));
        this.router.get("/result-summary", validate, wrapAsyncWithErrorHandling(this.getTournamentResultSummary, this));
        this.router.get("/:tournamentId", TournamentRequestSchema, validate, wrapAsyncWithErrorHandling(this.getTournament, this));
        this.router.get("/:tournamentId/entry/:userId", TournamentEntryRequestSchema, validate, wrapAsyncWithErrorHandling(this.getTournamentEntry, this));
        this.router.post("/:tournamentId/entry/:userId", EnterTournamentRequestSchema, validate, wrapAsyncWithErrorHandling(this.enterTournament, this));
        this.router.post("/:tournamentId/update-entry/:userId", EnterTournamentRequestSchema, validate, wrapAsyncWithErrorHandling(this.updateTournamentEntry, this));
        this.router.get("/:tournamentId/scorecard/:scorecardId/:userId", TournamentScorecardRequestSchema, validate, wrapAsyncWithErrorHandling(this.getTournamentScorecard, this));
        this.router.post("/:tournamentId/scorecard/:scorecardId/:userId", SaveTournamentScorecardRequestSchema, validate, wrapAsyncWithErrorHandling(this.updateTournamentScorecard, this));
        this.router.get("/:tournamentId/leaderboard/:leaderboardId/:userId", TournamentLeaderboardRequestSchema, validate, wrapAsyncWithErrorHandling(this.getTournamentLeaderboard, this));
        this.router.get("/:tournamentId/result", validate, wrapAsyncWithErrorHandling(this.getTournamentResults, this));
        this.router.post("/create-tournament",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.createTournament, this));
        this.router.post("/update-tournament",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.updateTournament, this));
        this.router.get("/leaderboard/:tournamentId", wrapAsyncWithErrorHandling(this.getTournamentLeaderboardForView, this));
        this.router.get("/player-scorecard/:tournamentId/:userId", wrapAsyncWithErrorHandling(this.getPlayerScorecard, this));
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * @swagger
     * /tournament/create-tournament:
     *  post:
     *      description: Enter tournament
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *            in: body
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async createTournament(req: Request, res: Response, next: NextFunction) {
        const tournament = await this.tournamentManagementService.createTournament(req);
        res.status(200).send(tournament);
    }
    /**
     * @swagger
     * /tournament/create-tournament:
     *  post:
     *      description: Enter tournament
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *            in: body
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async updateTournament(req: Request, res: Response, next: NextFunction) {
        const tournament = await this.tournamentManagementService.updateTournament(req);
        res.status(200).send(tournament);
    }

    /**
     * @swagger
     * /tournament/:
     *  get:
     *      description: Get available tournaments
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/TournamentResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getTournaments(req: Request, res: Response, next: NextFunction) {
        const tournaments = await this.tournamentManagementService.getAvailableTournaments();

        res.status(200).send(Mapper.mapTournaments(tournaments) as TournamentResponse[]);
    }

    /**
     * @swagger
     * /tournament/all-tournaments:
     *  get:
     *      description: Get all tournaments
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/TournamentResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getAllTournaments(req: Request, res: Response, next: NextFunction) {
        const tournaments = await this.tournamentManagementService.getTournaments();
        res.status(200).send(Mapper.mapTournaments(tournaments) as TournamentResponse[]);
    }

    /**
     * @swagger
     * /tournament/{tournamentId}:
     *  get:
     *      description: Get tournament
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getTournament(req: Request, res: Response, next: NextFunction) {
        const tournamentId = req.params.tournamentId;
        const tournament = await this.tournamentManagementService.getTournament(tournamentId);

        res.status(200).send(Mapper.mapTournament(tournament) as TournamentResponse);
    }

    /**
     * @swagger
     * /tournament/{tournamentId}/entry/{userId}:
     *  get:
     *      description: Gets user tournament entry
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentEntryResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getTournamentEntry(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        //const userId = req.params.userId;
        const tournamentId = req.params.tournamentId;
        const tournamentEntry = await this.tournamentManagementService.getTournamentEntry(userId, tournamentId);

        res.status(200).send(Mapper.mapTournamentEntry(tournamentEntry));
    }

    /**
     * @swagger
     * /tournament/{tournamentId}/entry:
     *  post:
     *      description: Enter tournament
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: enterTournament
     *            type: EnterTournamentRequest
     *            in: body
     *            schema:
     *               $ref: '#/definitions/EnterTournamentRequest'
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentEntryResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async enterTournament(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        const tournamentId = req.params.tournamentId;
        const enterTournamentRequest = req.body as EnterTournamentRequest;

        const user = await this.userService.getUserById(userId);
        const tournamentEntry = await this.tournamentManagementService.enterTournament(
            userId,
            tournamentId,
            enterTournamentRequest.courseId,
            user.division,
            user.gender,
            enterTournamentRequest.handicapIndex,
            enterTournamentRequest.tee,
            enterTournamentRequest.teamName,
            enterTournamentRequest.accessToken
        );

        res.status(200).send(Mapper.mapTournamentEntry(tournamentEntry));
    }


    /**
     * @swagger
     * /tournament/{tournamentId}/update-entry:
     *  post:
     *      description: Update tournament entry
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: enterTournament
     *            type: EnterTournamentRequest
     *            in: body
     *            schema:
     *               $ref: '#/definitions/EnterTournamentRequest'
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentEntryResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async updateTournamentEntry(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        const tournamentId = req.params.tournamentId;
        const enterTournamentRequest = req.body as EnterTournamentRequest;

        const user = await this.userService.getUserById(userId);
        const tournamentEntry = await this.tournamentManagementService.updateTournamentEntry(
            userId,
            tournamentId,
            enterTournamentRequest.courseId,
            user.division,
            user.gender,
            enterTournamentRequest.handicapIndex,
            enterTournamentRequest.tee,
            enterTournamentRequest.teamName
        );

        res.status(200).send(Mapper.mapTournamentEntry(tournamentEntry));
    }


    /**
     * @swagger
     * /player-scorecard/{tournamentId}/{userId}:
     *  get:
     *      description: Gets player tournament scorecard (only one tee should is returned in the course tees array)
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: scorecardId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentScorecardResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getPlayerScorecard(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        const tournamentId = req.params.tournamentId;
        const tournamentScorecard = await this.tournamentManagementService.getPlayerScorecard(userId, tournamentId);
        /* Logger.debug(tournamentScorecard);
        Logger.debug(tournamentScorecard.tee);
        Logger.debug(tournamentScorecard.gender); */
        res.status(200).send(Mapper.mapTournamentScorecard(tournamentScorecard, tournamentScorecard.tee, tournamentScorecard.gender));
    }

    /**
     * @swagger
     * /tournament/{tournamentId}/scorecard/{scorecardId}/{userId}:
     *  get:
     *      description: Gets user tournament scorecard (only one tee is returned in the course tees array)
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: scorecardId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentScorecardResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getTournamentScorecard(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        const tournamentId = req.params.tournamentId;
        const scorecardId = req.params.scorecardId;
        const tournamentScorecard = await this.tournamentManagementService.getScorecardAndCourseData(userId, scorecardId);
        //Logger.debug(tournamentScorecard);
        //Logger.debug(tournamentScorecard.tee);
        //Logger.debug(tournamentScorecard.gender);
        res.status(200).send(Mapper.mapTournamentScorecard(tournamentScorecard, tournamentScorecard.tee, tournamentScorecard.gender));
    }

    /**
     * @swagger
     * /tournament/{tournamentId}/scorecard/{scorecardId}/{userId}:
     *  post:
     *      description: Update user tournament scorecard
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: scorecardId
     *            type: string
     *            required: true
     *            in: path
     *          - name: saveTournamentScorecard
     *            type: SaveTournamentScorecardRequest
     *            in: body
     *            schema:
     *               $ref: '#/definitions/SaveTournamentScorecardRequest'
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/TournamentScorecardResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async updateTournamentScorecard(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        const tournamentId = req.params.tournamentId;
        const scorecardId = req.params.scorecardId;
        const saveTournamentScorecardRequest = req.body as SaveTournamentScorecardRequest;
        const tournamentScorecard = await this.tournamentManagementService.updateScorecard(userId, scorecardId, saveTournamentScorecardRequest.scores);

        res.status(200).send(Mapper.mapTournamentScorecard(tournamentScorecard, tournamentScorecard.tee, tournamentScorecard.gender));
    }


    /**
     * @swagger
     * /tournament/{tournamentId}/leaderboard/{leaderboardId}/{userId}:
     *  get:
     *      description: Gets user tournament leaderboard
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: leaderboardId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/TournamentLeaderboardResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getTournamentLeaderboard(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.userId;
        const tournamentId = req.params.tournamentId;
        const leaderboardId = req.params.leaderboardId;
        const tournamentLeaderboard = await this.tournamentManagementService.getLeaderboard(userId, leaderboardId);
        
        res.status(200).send(Mapper.mapTournamentLeaderboards(tournamentLeaderboard) as TournamentLeaderboardResponse[]);
    }

    /**
     * @swagger
     * /tournament/{tournamentId}/leaderboard/{leaderboardId}:
     *  get:
     *      description: Gets user tournament leaderboard
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: leaderboardId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/TournamentLeaderboardResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getTournamentLeaderboardForView(req: Request, res: Response, next: NextFunction) {
        const tournamentId = req.params.tournamentId;
        const tournamentLeaderboard = await this.tournamentManagementService.getTournamentLeaderboard(tournamentId);
        res.status(200).send(Mapper.mapTournamentLeaderboardsView(tournamentLeaderboard) as TournamentLeaderboardResponse[]);
    }

    /**
     * @swagger
     * /tournament/result-summary:
     *  get:
     *      description: Gets tournament result summary
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: division
     *            type: string
     *            enum: [Champ, Celebrity, Professional Golfer]
     *            required: true
     *            in: query
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/TournamentResultSummaryResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getTournamentResultSummary(req: Request, res: Response, next: NextFunction) {
        const division = req.query.division as GolfDivision; 
        const tournamentResults = await this.tournamentManagementService.getFinishedTournamentsByDivision(true, division);

        res.status(200).send(Mapper.mapTournamentsToResultSummaries(tournamentResults) as TournamentResultSummaryResponse[]);
    }
    
    /**
     * @swagger
     * /tournament/{tournamentId}/result:
     *  get:
     *      description: Gets tournament result
     *      tags:
     *          - Tournament
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: tournamentId
     *            type: string
     *            required: true
     *            in: path
     *          - name: division
     *            type: string
     *            enum: [Champ, Celebrity, Professional Golfer]
     *            required: true
     *            in: query
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/TournamentResultResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getTournamentResults(req: Request, res: Response, next: NextFunction) {
        const tournamentId = req.params.tournamentId;
        const division = req.query.division as GolfDivision; 
        const tournamentResults = await this.tournamentManagementService.getTournamentResults(tournamentId, division);

        res.status(200).send(Mapper.mapTournamentResults(tournamentResults) as TournamentResultResponse[]);
    }
    
}