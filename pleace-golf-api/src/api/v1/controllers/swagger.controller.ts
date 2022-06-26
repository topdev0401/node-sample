import { Router } from "express";
import config from '../../../config';

export class SwaggerController {
    private router: Router;

    public constructor() {
        this.router = Router();
        this.init();
    }

    public getRouter(): Router {
        return this.router;
    }

    private init() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: "API",
                    description: "API definition",
                },
                host: config.api.baseAddress,
                basePath: "/api",
                securityDefinitions: {
                    "bearer": {
                        "type": "apiKey",
                        "in": "header",
                        "name": "Authorization"
                    }
                },
                security: [
                    {
                        "bearer": [] as any
                    }
                ]
            },
            apis: ["./src/api/v1/controllers/*.ts", "./src/api/v1/dtos/**/*.ts"]
        };

        const swaggerJSDoc = require("swagger-jsdoc");
        const swaggerUi = require("swagger-ui-express");
        const swaggerSpec = swaggerJSDoc(options);

        this.router.get("/json", function (req, res) {
            res.setHeader("Content-Type", "application/json");
            res.send(swaggerSpec);
        });

        this.router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }
}
