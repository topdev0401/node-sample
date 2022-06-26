import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import * as passport from "passport";
import { Logger } from "../../../core/logging";
import { wrapAsyncWithErrorHandling } from "../../handlers/error-handler";
import { Mapper } from "../mapper";
import { validate } from "../../../core/validation/validator";
import { TournamentManagementService } from "../../../services/tournament-management.service";
import { RankingResponse } from "../dtos/response";
import { GolfDivision } from "../../../types/golf-division.enum";
import { RankingRequestSchema } from "../dtos/request/ranking.request";
import { UserService } from "../../../services/user.service";
import { IndividualRankingResponse } from "../dtos/response/individual-ranking.response";
import { IndividualRankingRequestSchema } from "../dtos/request/individual-ranking.request";

export class RankingController {
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
        this.router.get("/", RankingRequestSchema, validate, wrapAsyncWithErrorHandling(this.getRankings, this));
        this.router.get("/individual", IndividualRankingRequestSchema, validate, wrapAsyncWithErrorHandling(this.getIndividualRanking, this));
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * @swagger
     * /ranking/:
     *  get:
     *      description: Get ranking
     *      tags:
     *          - Ranking
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: countryCode
     *            type: array
     *            required: false
     *            in: query
     *            items:
     *                type: string
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
     *                      $ref: '#/definitions/RankingResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getRankings(req: Request, res: Response, next: NextFunction) {
        const countryCodes = req.query.countryCode as string[] || []; 
        const division = req.query.division as GolfDivision; 
        const rankings = await this.tournamentManagementService.getRanking(countryCodes, division);
        console.log('rankings:::',rankings);
        let mappedRank = Mapper.mapRankings(rankings) as RankingResponse[];
        //console.log('b mappedRank:::',mappedRank);
        const existingRank = await this.tournamentManagementService.getStaticLatestRank(countryCodes, division);
        //console.log('existingRank:::',existingRank);
        let rankingResp:RankingResponse[] = [];
        let userWithPoints = mappedRank.map(m => m.user);
        console.log('R >> userWithPoints',userWithPoints);
        existingRank.forEach((element)=> {
            let totalPoints = element.totalPoints;
            let rounds = element.rounds
            userWithPoints.push(element.user);
            //if new results exists with same user sum the points.
            if(element.user) {
                let index = mappedRank.findIndex(o=> o.user.toString() == element.user.toString());
                if(index > -1) {
                    totalPoints = totalPoints + mappedRank[index].totalPoints;
                    rounds = rounds + mappedRank[index].rounds;
                    mappedRank.splice(index,1);
                }
            }
            
            let rank:RankingResponse = {
                user : element.user,
                position : element.position,
                name : element.firstName + " " + element.lastName,
                totalPoints : totalPoints,
                countryCode : element.nationality,
                rounds : rounds
            }
            rankingResp.push(rank);
        });

        let userWithNoPoints = await this.tournamentManagementService.getUsersWithNoPoints(countryCodes, division,userWithPoints);
        let userWithNoPointsResponse = [];
        userWithNoPoints.forEach((element)=> {
            let rank:RankingResponse = {
                user : element._id,
                position : -1,
                name : element.firstName + " " + element.lastName,
                totalPoints : 0,
                countryCode : element.nationality,
                rounds : 0
            }
            userWithNoPointsResponse.push(rank);
        })
        //console.log('a mappedRank:::',mappedRank);
        let absoluteResp = rankingResp.concat(mappedRank).concat(userWithNoPointsResponse).sort(function(a,b) {
            return b.totalPoints - a.totalPoints;
        })
        res.status(200).send(absoluteResp);
    }
    

    /**
     * @swagger
     * /ranking/individual:
     *  get:
     *      description: Get individual ranking of user
     *      tags:
     *          - Ranking
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: countryCode
     *            type: array
     *            required: false
     *            in: query
     *            items:
     *                type: string
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  $ref: '#/definitions/IndividualRankingResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getIndividualRanking(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.user.sub;
        const countryCodes = req.query.countryCode as string[] || [];

        const user = await this.userService.getUserById(userId);
        const ranking = await this.tournamentManagementService.getIndividualRanking(userId, countryCodes, user.division);

        res.status(200).send({position: ranking} as IndividualRankingResponse);
    }
}