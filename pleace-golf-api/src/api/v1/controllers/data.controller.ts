import { Request, Response, NextFunction } from "express";
import { Router } from "express";
import { Logger } from "../../../core/logging";
import { wrapAsyncWithErrorHandling } from "../../handlers/error-handler";
import { DataImporter } from "../../../data/data-importer";
import config from '../../../config';
import { validate } from "../../../core/validation/validator";
import { AddCourseTeeRequest } from "../dtos/request/add-course-tee.request";
import { DataTransformer } from "../../../data/data-transformer";
import { DataImportAndTransformRequestSchema } from "../dtos/request/data-import-and-transform.request";

export class DataController {
    private readonly dataImporter: DataImporter;
    private readonly dataTransformer: DataTransformer;
    private router: Router;

    constructor(dataImporter: DataImporter, dataTransformer: DataTransformer) {
        this.dataImporter = dataImporter;
        this.dataTransformer = dataTransformer;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router = Router();
        this.router.get("/transform", DataImportAndTransformRequestSchema, validate, wrapAsyncWithErrorHandling(this.transformData, this));
        this.router.get("/import", DataImportAndTransformRequestSchema, validate, wrapAsyncWithErrorHandling(this.importData, this));
        this.router.get("/import-club-data", wrapAsyncWithErrorHandling(this.importClubData, this));
        this.router.post("/course/tee", wrapAsyncWithErrorHandling(this.addCourseTees, this));
    }
    
    public getRouter(): Router {
        return this.router;
    }

    /**
    * @swagger
    * /data/transform:
    *  get:
    *      description: Transform data
    *      tags:
    *          - Data
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: key
    *            type: string
    *            required: true
    *            in: query
    *      responses:
    *          200:
    *              description: OK
    *          404:
    *              description: Resource not found
    *          500:
    *              description: Server error
    */
    public async transformData(req: Request, res: Response, next: NextFunction) {
        const key = req.query.key.toString();

        if (config.dataImportKey === key) {
            await this.dataTransformer.transformData();
            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }


    /**
    * @swagger
    * /data/import:
    *  get:
    *      description: Import data
    *      tags:
    *          - Data
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: key
    *            type: string
    *            required: true
    *            in: query
    *      responses:
    *          200:
    *              description: OK
    *          404:
    *              description: Resource not found
    *          500:
    *              description: Server error
    */
    public async importData(req: Request, res: Response, next: NextFunction) {
        const key = req.query.key.toString();

        if (config.dataImportKey === key) {
            await this.dataImporter.importData();
            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }


    /**
    * @swagger
    * /data/course/tee:
    *  post:
    *      description: Add course tees.
    *      tags:
    *          - Data
    *      produces:
    *          - application/json
    *      parameters:
    *          - name: key
    *            type: string
    *            required: true
    *            in: query
    *          - name: add course teees
    *            type: AddCourseTeeRequest
    *            in: body
    *            schema:
    *               $ref: '#/definitions/AddCourseTeeRequest'
    *      responses:
    *          200:
    *              description: OK
    *          400:
    *              description: Missing or invalid parameter.
    *          500:
    *              description: Server error
    */
    public async addCourseTees(req: Request, res: Response, next: NextFunction) {
        const addCourseTeeRequest = req.body as AddCourseTeeRequest;
        const key = req.query.key.toString();

        if (config.dataImportKey === key) {
            for (let courseTeeRequest of addCourseTeeRequest.courses) {
                await this.dataImporter.addCourseTees(courseTeeRequest);
            }
            
            res.status(200).send();
        }
        else {
            res.status(401).send();
        }
    }


    /**
    * @swagger
    * /data/import-club-data:
    *  get:
    *      description: Import data
    *      tags:
    *          - Data
    *      produces:
    *          - application/json
    *      responses:
    *          200:
    *              description: OK
    *          404:
    *              description: Resource not found
    *          500:
    *              description: Server error
    */
     public async importClubData(req: Request, res: Response, next: NextFunction) {
        //const key = req.query.key.toString();
        await this.dataImporter.importClubData();
        res.status(200).send();
        
    }

}