import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Logger } from "../../../core/logging";
import { wrapAsyncWithErrorHandling } from "../../handlers/error-handler";
import { CountryService } from "../../../core/country/country-service";
import { Mapper } from "../mapper";
import { CountryResponse } from "../dtos/response";

export class CountryController {
    private readonly countryService: CountryService;
    private router: Router;

    constructor(countryService: CountryService) {
        this.countryService = countryService;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = Router();
        this.router.get("/", wrapAsyncWithErrorHandling(this.getCountries, this));
    }

    public getRouter(): Router {
        return this.router;
    }

    /**
     * @swagger
     * /country/:
     *  get:
     *      description: Gets all countries
     *      tags:
     *          - Country
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: OK
     *              schema:
     *                  type: array
     *                  items:
     *                      $ref: '#/definitions/CountryResponse'
     *          404:
     *              description: Resource not found
     *          500:
     *              description: Server error
     */
    public async getCountries(req: Request, res: Response, next: NextFunction) {
        //const countries = this.countryService.getCountries().sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        const countries = this.countryService.getCountries();
        res.status(200).send(Mapper.mapCountries(countries) as CountryResponse[]);
    }
}