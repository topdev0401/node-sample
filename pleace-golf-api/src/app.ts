import { Request, Response, Application } from "express";
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as passport from "passport";

import { v4 as uuid } from "uuid";
import * as helmet from "helmet";
import * as cors from "cors";

import config from './config';
import { PassportAuth } from "./api/auth/passport";
import { handleErrors } from "./api/handlers/error-handler";
import { UserService } from "./services/user.service";

import * as logMiddleware from "./core/express/log.middleware";
import { AgendaDependency } from "./core/dependencies/agenda/agenda.dependency";

export class App {
    private readonly app: Application;
    private readonly routersMap: { [version: string]: any };
    private readonly userService: UserService;
    private readonly agendaDependency: AgendaDependency;

    public constructor(routersMap: { [version: string]: any }, userService: UserService, agendaDependency: AgendaDependency) {
        this.routersMap = routersMap;
        this.userService = userService;
        this.agendaDependency = agendaDependency;
        this.app = express();
        this._initBeforeRoutesMiddleware();
        this._initRoutes();
        this._initAfterRoutesMiddleware();
    }

    public getApp(): Application {
        return this.app;
    }

    private _initBeforeRoutesMiddleware(): void {
        this.app.use(bodyParser.json({ limit: "1mb" }));
        this.app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
        this.app.use(helmet());
        this.app.use(passport.initialize());
        this.app.use(this._addRequestId);
        this.app.use(logMiddleware.initialize({ obfuscate: config.environment === "production" }));

        if (config.environment === "development") {

            //var whitelist = ['http://example1.com', 'http://example2.com']
            var corsOptions = {
                origin: [`${config.app.scheme}://${config.app.baseAddress}`, `${config.api.scheme}://${config.api.baseAddress}`],
            }
            this.app.use(cors(corsOptions));
            //this.app.options('*', cors());
        }

        PassportAuth.configAuth(passport, this.userService);
    }

    private _initAfterRoutesMiddleware(): void {
        this.app.use(handleErrors);
    }

    private _addRequestId(req: Request, res: Response, next: Function) {
        if (!req.body.requestId) {
            const requestId = uuid();
            req.body = { ...req.body, requestId: requestId };
        }
        next();
    }

    private _initRoutes(): void {
        for (const version in this.routersMap) {
            this.app.use("/api/" + version, this.routersMap[version].getRouter());
        }
        this.agendaDependency.addAgendash(this.app);
    }
}
