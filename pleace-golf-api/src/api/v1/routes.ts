import { Router } from "express";

import * as controllers from "./controllers";
import { AuthenticationService } from "../../services/authentication.service";
import { UserService } from "../../services/user.service";
import { CountryService } from "../../core/country/country-service";
import { GolfClubService } from "../../services/golf-club.service";
import { TournamentManagementService } from "../../services/tournament-management.service";
import { DataImporter } from "../../data/data-importer";
import { DataTransformer } from "../../data/data-transformer";
import { CommonService } from "../../services/common.service";

export class ApiRouter {
    private readonly swaggerController: controllers.SwaggerController;
    private readonly authenticationController: controllers.AuthenticationController;
    private readonly userController: controllers.UserController;
    private readonly golfClubController: controllers.GolfClubController;
    private readonly tournamentController: controllers.TournamentController;
    private readonly countryController: controllers.CountryController;
    private readonly dataController: controllers.DataController;
    private readonly rankingController: controllers.RankingController;
    private readonly commonController: controllers.CommonController;

    private readonly router: Router;

    constructor(
        authService: AuthenticationService,
        userService: UserService,
        countryService: CountryService,
        golfClubService: GolfClubService,
        tournamentManagmentService: TournamentManagementService,
        dataImporter: DataImporter,
        dataTransformer: DataTransformer,
        commonService : CommonService
    ) {
        this.swaggerController = new controllers.SwaggerController();
        this.authenticationController = new controllers.AuthenticationController(authService, userService);
        this.userController = new controllers.UserController(userService);
        this.golfClubController = new controllers.GolfClubController(golfClubService);
        this.tournamentController = new controllers.TournamentController(tournamentManagmentService, userService);
        this.countryController = new controllers.CountryController(countryService);
        this.dataController = new controllers.DataController(dataImporter, dataTransformer);
        this.rankingController = new controllers.RankingController(tournamentManagmentService, userService);
        this.commonController = new controllers.CommonController(commonService);
        this.router = Router();
        this._init();
    }

    public getRouter(): Router {
        return this.router;
    }

    private _init() {
        this.router.use("/swagger", this.swaggerController.getRouter());
        this.router.use("/auth", this.authenticationController.getRouter());
        this.router.use("/user", this.userController.getRouter());
        this.router.use("/golf-club", this.golfClubController.getRouter());
        this.router.use("/tournament", this.tournamentController.getRouter());
        this.router.use("/country", this.countryController.getRouter());
        this.router.use("/data", this.dataController.getRouter());
        this.router.use("/ranking", this.rankingController.getRouter());
        this.router.use("/common", this.commonController.getRouter());
    }
}
