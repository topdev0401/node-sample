import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { CommonService } from "../../../services/common.service";
import * as passport from "passport";
import { wrapAsyncWithErrorHandling } from "../../handlers/error-handler";


export class CommonController {
    private router: Router;

    constructor(private commonService:CommonService) {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = Router();
        this.router.get("/get-categories", wrapAsyncWithErrorHandling(this.getCategories, this));
        this.router.post("/create-invite",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.createInvite, this));
        this.router.get("/get-invite-details/:inviteId", wrapAsyncWithErrorHandling(this.getInviteDetails, this));
        this.router.get("/get-celeb-index-ranking", passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getCelebIndexRanking, this));
        this.router.get("/invitation-used/:inviteId/:userId", wrapAsyncWithErrorHandling(this.invitationUsed, this));
        this.router.get("/invitation-declined/:inviteId", wrapAsyncWithErrorHandling(this.invitationDeclined, this));
        this.router.post("/verify-invitee/:inviteId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.verifyInvitee, this));
        this.router.get("/get-all-golf-courses", wrapAsyncWithErrorHandling(this.getAllGolfCourses, this));
        this.router.get("/find-golf-courses/:searchStr",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.findGolfCourses, this));
        this.router.get("/find-golf-clubs/:searchStr/:countryCode", wrapAsyncWithErrorHandling(this.findGolfClubs, this));
        this.router.get("/get-golf-club-info/:clubId", wrapAsyncWithErrorHandling(this.getClubInfoById, this));
        this.router.get("/get-golf-course-info/:courseId", wrapAsyncWithErrorHandling(this.getCourseInfoById, this));
        this.router.post("/update-golf-course",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.updateGolfCourse, this));
        this.router.post("/update-golf-club-course", wrapAsyncWithErrorHandling(this.updateClubCourseDetails, this));
        this.router.get("/golf-course-scorecard/:courseId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getCourseScoreCard, this));
        this.router.delete("/delete-golf-course/:courseId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.deleteGolfCourse, this));
        this.router.delete("/delete-golf-club/:clubId", wrapAsyncWithErrorHandling(this.deleteGolfClub, this));
        this.router.get("/get-all-invitees/:from",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getAllInvitees, this));
        this.router.get("/get-invitees-by-country/:countryCode",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getInviteesByCourtry, this));
        this.router.get("/get-Celebrity-types",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getCelebrityTypes, this));
        this.router.post("/notify-single-club",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.notifySingleClub, this));
        this.router.post("/notify-all-club",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.notifyAllClub, this));
        this.router.get("/get-all-tournament",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getAllTournament, this));
        this.router.delete("/delete-invitee/:inviteId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.deleteInvitee, this));
        this.router.get("/get-challengers",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getChallengers, this));
        this.router.get("/get-entered-tournaments/:userId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getEnteredTournaments, this));
        this.router.get("/get-tournament-entries/:tournamentId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getTournamentEntries, this));
        this.router.post("/add-challengers/:tournamentId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.addChallengers, this));
        this.router.delete("/delete-tournament/:tournamentId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.deleteTournament, this));
        this.router.delete("/leave-tournament/:tournamentId/:userId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.leaveTournament, this));
        this.router.get("/get-all-players",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getAllPlayers, this));
        this.router.delete("/delete-player/:userId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.deletePlayerByAdmin, this));
        this.router.post("/add-golf-club", wrapAsyncWithErrorHandling(this.addGolfClub, this));
        this.router.post("/need-help",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.needHelp, this));
        this.router.get("/get-amateur-tokens/:userId",passport.authenticate("jwt", { session: false }), wrapAsyncWithErrorHandling(this.getAmateurTokens, this));

    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * @swagger
     * /common/get-categories/:
     *  get:
     *      description: Gets all categories
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getCategories(req: Request, res: Response, next: NextFunction) {
        /* const categories = await CategorySchema.find({});
        res.status(200).send(categories.map(c => c.name)); */
        await this.commonService.getCategories(req,res);
    }


    /**
     * @swagger
     * /common/create-invite/:
     *  post:
     *      description: Create invite
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: user
     *          schema:
     *          type: object
     *          required:
     *          - firstName
     *          properties:
     *              firstName:
     *                  type:string
     *              lastName:
     *                  type:string
     *              category:
     *                  type:string
     *              type:
     *                  type:string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async createInvite(req: Request, res: Response) {
        /* const categories = await CategorySchema.find({});
        res.status(200).send(categories.map(c => c.name)); */

        await this.commonService.createInvite(req,res);
    }

    /**
     * @swagger
     * /common/get-invite-details/{inviteId} :
     *  get:
     *      description: Gets all categories
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getInviteDetails(req: Request, res: Response) {
        await this.commonService.getInviteDetails(req,res);
    }

    /**
     * @swagger
     * /common/get-celeb-index-ranking/:
     *  get:
     *      description: Gets all categories
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getCelebIndexRanking(req: Request, res: Response) {
        /* const categories = await CategorySchema.find({}); 
        res.status(200).send(categories.map(c => c.name)); */
        await this.commonService.getCelebIndexRanking(req,res);
    }


    /**
     * @swagger
     * /common/invitation-used/{inviteId}/{userId}:
     *  get:
     *      description: Gets all categories
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async invitationUsed(req: Request, res: Response) {
        /* const categories = await CategorySchema.find({});
        res.status(200).send(categories.map(c => c.name)); */
        await this.commonService.invitationUsed(req,res);
    }

    /**
     * @swagger
     * /common/invitation-declined/{inviteId}:
     *  get:
     *      description: invitation decline
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async invitationDeclined(req: Request, res: Response) {
        await this.commonService.invitationDeclined(req,res);
    }

    /**
     * @swagger
     * /common/get-all-golf-courses/:
     *  get:
     *      description: Get All Golf Courses
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getAllGolfCourses(req: Request, res: Response) {
        const allGolfCourses = await this.commonService.getAllGolfCourses();
        res.status(200).send(allGolfCourses);
    }

    /**
     * @swagger
     * /common/find-golf-courses/{searchStr}:
     *  get:
     *      description: find golf courses
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: searchStr
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async findGolfCourses(req: Request, res: Response) {
        const allGolfCourses = await this.commonService.findGolfCourses(req.params.searchStr);
        res.status(200).send(allGolfCourses);
    }


    /**
     * @swagger
     * /common/get-golf-club-info/{clubId}:
     *  get:
     *      description: find golf courses
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: clubId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getClubInfoById(req: Request, res: Response) {
        const allGolfCourses = await this.commonService.getClubInfoById(req.params.clubId);
        res.status(200).send(allGolfCourses);
    }

    /**
     * @swagger
     * /common/get-golf-course-info/{courseId}:
     *  get:
     *      description: find golf courses
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: clubId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getCourseInfoById(req: Request, res: Response) {
        const golfCourse = await this.commonService.getCourseInfoById(req.params.courseId);
        res.status(200).send(golfCourse);
    }

    /**
     * @swagger
     * /common/update-golf-course/:
     *  post:
     *      description: Update Golf Course
     *      tags:
     *          - Common
     *      consumes:
     *          - application/json
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: golf course details
     *          description: The user to create.
     *          schema:
     *              type: object
     *              properties:
     *                  _id:
     *                      type: string
     *                  name:
     *                      type: string
     *                  numberOfHoles:
     *                      type: string
     *                  type:
     *                      type: string
     *                  par:
     *                      type: string
     *                  rating:
     *                      type: string
     *                  slope:
     *                      type: string
     *                  length:
     *                      type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: object
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async updateGolfCourse(req: Request, res: Response) {
        const updatedGolfCourse = await this.commonService.updateGolfCourse(req);
        res.status(200).send(updatedGolfCourse);
    }


    /**
     *  @swagger
     * /common/golf-course-scorecard/{courseId}:
     *  get:
     *      description: find golf courses
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getCourseScoreCard(req: Request, res: Response) {
        const courseScorecard = await this.commonService.getCourseScoreCard(req.params.courseId);
        res.status(200).send(courseScorecard);
    }


    /**
     *  @swagger
     * /common/delete-golf-course/{courseId}:
     *  delete:
     *      description: Delete Golf Course
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async deleteGolfCourse(req: Request, res: Response) {
        const deletedCourse = await this.commonService.deleteGolfCourse(req.params.courseId);
        res.status(200).send(deletedCourse);
    }

    /**
     *  @swagger
     * /common/delete-golf-club/{clubId}:
     *  delete:
     *      description: Delete Golf Course
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async deleteGolfClub(req: Request, res: Response) {
        const deletedClub = await this.commonService.deleteGolfClub(req.params.clubId);
        res.status(200).send(deletedClub);
    }

    /**
     * @swagger
     * /common/find-golf-clubs/{searchStr}/{countryCode}:
     *  get:
     *      description: find golf clubs
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: searchStr
     *            type: string
     *            required: true
     *            in: path
     *          - name: countryCode
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async findGolfClubs(req: Request, res: Response) {
        const allGolfClubs = await this.commonService.findGolfClubs(req.params.searchStr,req.params.countryCode);
        res.status(200).send(allGolfClubs);
    }

    /**
     * @swagger
     * /common/get-all-invitees/:
     *  get:
     *      description: Gets all invitees
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getAllInvitees(req: Request, res: Response) {
        const invitees = await this.commonService.getAllInvitees(req);
        res.status(200).send(invitees);
    }

    /**
     * @swagger
     * /common/get-Celebrity-types/:
     *  get:
     *      description: Gets all Celebrity types
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getCelebrityTypes(req: Request, res: Response) {
        console.log('request>>> ',req.user);
        const CelebrityTypes = await this.commonService.getCelebrityTypes();
        res.status(200).send(CelebrityTypes);
    }

    /**
     * @swagger
     * /common/update-golf-club-course/:
     *  post:
     *      description: Update Golf Course
     *      tags:
     *          - Common
     *      consumes:
     *          - application/json
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: golf course details
     *          description: The user to create.
     *          schema:
     *              type: object
     *              properties:
     *                  _id:
     *                      type: string
     *                  name:
     *                      type: string
     *                  numberOfHoles:
     *                      type: string
     *                  type:
     *                      type: string
     *                  par:
     *                      type: string
     *                  rating:
     *                      type: string
     *                  slope:
     *                      type: string
     *                  length:
     *                      type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: object
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async updateClubCourseDetails(req: Request, res: Response) {
        const updatedGolfCourse = await this.commonService.updateClubCourseDetails(req);
        res.status(200).send(updatedGolfCourse);
    }

    /**
     * @swagger
     * /common/notify-single-club/:
     *  post:
     *      description: Update Golf Course
     *      tags:
     *          - Common
     *      consumes:
     *          - application/json
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: golf course details
     *          description: The user to create.
     *          schema:
     *              type: object
     *              properties:
     *                  _id:
     *                      type: string
     *                  name:
     *                      type: string
     *                  numberOfHoles:
     *                      type: string
     *                  type:
     *                      type: string
     *                  par:
     *                      type: string
     *                  rating:
     *                      type: string
     *                  slope:
     *                      type: string
     *                  length:
     *                      type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: object
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async notifySingleClub(req: Request, res: Response) {
        const updatedGolfCourse = await this.commonService.notifySingleClub(req);
        res.status(200).send(updatedGolfCourse);
    }

    /**
     * @swagger
     * /common/notify-single-club/:
     *  post:
     *      description: Update Golf Course
     *      tags:
     *          - Common
     *      consumes:
     *          - application/json
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: golf course details
     *          description: The user to create.
     *          schema:
     *              type: object
     *              properties:
     *                  _id:
     *                      type: string
     *                  name:
     *                      type: string
     *                  numberOfHoles:
     *                      type: string
     *                  type:
     *                      type: string
     *                  par:
     *                      type: string
     *                  rating:
     *                      type: string
     *                  slope:
     *                      type: string
     *                  length:
     *                      type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: object
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async notifyAllClub(req: Request, res: Response) {
        const updatedGolfCourse = await this.commonService.notifyAllClub(req);
        res.status(200).send(updatedGolfCourse);
    }

    /**
     * @swagger
     * /common/get-all-tournament/:
     *  get:
     *      description: Gets all tournament
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getAllTournament(req: Request, res: Response) {
        //console.log('request>>> ',req.user);
        const tournments = await this.commonService.getAllTournament();
        res.status(200).send(tournments);
    }

    /**
     * @swagger
     * /common/get-invitees-by-country/{countryCode} :
     *  get:
     *      description: Gets all invitees by country
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getInviteesByCourtry(req: Request, res: Response) {
        const invitees = await this.commonService.getInviteesByCourtry(req.params.countryCode);
        res.status(200).send(invitees);
    }

    /**
     * @swagger
     * /common/verify-invitee/{:inviteId}:
     *  get:
     *      description: Gets all tournament
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async verifyInvitee(req: Request, res: Response) {
        //console.log('request>>> ',req.user);
        const invitee = await this.commonService.verifyInvitee(req);
        res.status(200).send({savedInvite:invitee});
    }

    /**
     *  @swagger
     * /common/delete-invitee/{inviteId}:
     *  delete:
     *      description: Delete Golf Course
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async deleteInvitee(req: Request, res: Response) {
        const deletedInvitee = await this.commonService.deleteInvitee(req.params.inviteId);
        res.status(200).send(deletedInvitee);
    }


    /**
     * @swagger
     * /common/get-challengers/ :
     *  get:
     *      description: Gets all challengers
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getChallengers(req: Request, res: Response) {
        const challengers = await this.commonService.getChallengers();
        res.status(200).send(challengers);
    }


    /**
     * @swagger
     * /common/get-entered-tournaments/{userId}:
     *  get:
     *      description: Gets entered tournaments
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getEnteredTournaments(req: Request, res: Response) {
        const tournaments = await this.commonService.getEnteredTournaments(req);
        res.status(200).send(tournaments);
    }


    /**
     * @swagger
     * /common/get-tournament-entries/{tournamentId}:
     *  get:
     *      description: Gets tournament entries
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getTournamentEntries(req: Request, res: Response) {
        const tournaments = await this.commonService.getTournamentEntries(req);
        res.status(200).send(tournaments);
    }


     /**
     * @swagger
     * /common/add-challengers/{tournamentId}:
     *  post:
     *      description: Add Challengers
     *      tags:
     *          - Common
     *      consumes:
     *          - application/json
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: golf course details
     *          description: The user to create.
     *          schema:
     *              type: object
     *              properties:
     *                  _id:
     *                      type: string
     *                  name:
     *                      type: string
     *                  numberOfHoles:
     *                      type: string
     *                  type:
     *                      type: string
     *                  par:
     *                      type: string
     *                  rating:
     *                      type: string
     *                  slope:
     *                      type: string
     *                  length:
     *                      type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: object
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
      public async addChallengers(req: Request, res: Response) {
        const udpateTournament = await this.commonService.addChallengers(req);
        res.status(200).send(udpateTournament);
    }

    /**
     *  @swagger
     * /common/delete-tournament/{tournamentId}:
     *  delete:
     *      description: Delete Golf Course
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async deleteTournament(req: Request, res: Response) {
        const deletedTour = await this.commonService.deleteTournament(req);
        res.status(200).send(deletedTour);
    }


    /**
     *  @swagger
     * /common/leave-tournament/{tournamentId}/{userId}:
     *  delete:
     *      description: Leave Tournament
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async leaveTournament(req: Request, res: Response) {
        const deletedTour = await this.commonService.leaveTournament(req);
        res.status(200).send(deletedTour);
    }

    /**
     *  @swagger
     * /common/get-all-players/:
     *  get:
     *      description: Leave Tournament
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getAllPlayers(req: Request, res: Response) {
        const players = await this.commonService.getAllPlayers();
        res.status(200).send(players);
    }


    /**
     *  @swagger
     * /common/delete-player/{userId}:
     *  delete:
     *      description: Leave Tournament
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async deletePlayerByAdmin(req: Request, res: Response) {
        const deletedPlayer = await this.commonService.deletePlayerByAdmin(req);
        res.status(200).send(deletedPlayer);
    }

    /**
     * @swagger
     * /common/add-golf-club/:
     *  post:
     *      description: Update Golf Course
     *      tags:
     *          - Common
     *      consumes:
     *          - application/json
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: golf course details
     *          description: The user to create.
     *          schema:
     *              type: object
     *              properties:
     *                  _id:
     *                      type: string
     *                  name:
     *                      type: string
     *                  numberOfHoles:
     *                      type: string
     *                  type:
     *                      type: string
     *                  par:
     *                      type: string
     *                  rating:
     *                      type: string
     *                  slope:
     *                      type: string
     *                  length:
     *                      type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: object
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async addGolfClub(req: Request, res: Response) {
        const newClub = await this.commonService.addGolfClub(req);
        res.status(200).send(newClub);
    }

    /**
     * @swagger
     * /common/need-help:
     *  post:
     *      description: Update Golf Course
     *      tags:
     *          - Common
     *      consumes:
     *          - application/json
     *      produces:
     *          - application/json
     *      parameters:
     *        - in: body
     *          name: golf course details
     *          description: The user to create.
     *          schema:
     *              type: object
     *              properties:
     *                  _id:
     *                      type: string
     *                  name:
     *                      type: string
     *                  numberOfHoles:
     *                      type: string
     *                  type:
     *                      type: string
     *                  par:
     *                      type: string
     *                  rating:
     *                      type: string
     *                  slope:
     *                      type: string
     *                  length:
     *                      type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: object
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async needHelp(req: Request, res: Response) {
        const response = await this.commonService.needHelp(req);
        res.status(200).send(response);
    }


    /**
     *  @swagger
     * /common/get-amateur-tokens/{userId}:
     *  get:
     *      description: Get Amateur Tokens
     *      tags:
     *          - Common
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: courseId
     *            type: string
     *            required: true
     *            in: path
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
     public async getAmateurTokens(req: Request, res: Response) {
        const tokens = await this.commonService.getAmateurTokens(req.params.userId);
        res.status(200).send(tokens);
    }
    
}