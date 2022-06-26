import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Logger } from "../../../core/logging";
import { wrapAsyncWithErrorHandling } from "../../handlers/error-handler";
import { Mapper } from "../mapper";
import { GolfClubService } from "../../../services/golf-club.service";
import { GolfClubRequestSchema } from "../dtos/request/golf-club.request";
import { validate } from "../../../core/validation/validator";
import { GolfClubResponse } from "../dtos/response";

export class GolfClubController {
    private readonly golfClubService: GolfClubService;
    private router: Router;

    constructor(golfClubService: GolfClubService) {
        this.golfClubService = golfClubService;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = Router();
        this.router.get("/", GolfClubRequestSchema, validate, wrapAsyncWithErrorHandling(this.getGolfClubs, this));
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * @swagger
     * /golf-club/:
     *  get:
     *      description: Get golf clubs
     *      tags:
     *          - Golf Club
     *      produces:
     *          - application/json
     *      parameters:
     *          - name: countryCode
     *            type: string
     *            required: true
     *            in: query
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/GolfClubResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getGolfClubs(req: Request, res: Response, next: NextFunction) {
        const countryCode = req.query.countryCode.toString();
        const golfClubs = await this.golfClubService.getGolfClubs(countryCode);

        res.status(200).send(Mapper.mapGolfClubs(golfClubs) as GolfClubResponse[]);
    }
}