/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as path from "path";
import * as fs from "fs";
import * as winston from "winston";
const DailyRotateFile = require("winston-daily-rotate-file");
import * as loggerConfig from "../../../logging.config.json";
import config from '../../config';
import { WinstonTransportConfig, WinstonConfig } from "./winston.config";


export namespace Logger {

    function createLogsDirectory(filePath: string) {
        const directory = path.dirname(filePath);

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
    }

    function createTransport(transport: WinstonTransportConfig) {
        if (transport.type === "console") {
            return new winston.transports.Console({
                level: transport.level,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.errors({ stack: true }),
                    winston.format.json()
                )
            });
        } else {
            createLogsDirectory(transport.filename);
            return new DailyRotateFile({
                name: `file#${transport.level}`,
                filename: transport.filename,
                datePattern: "YYY-MM-DD-HH",
                prepend: true,
                level: transport.level
            });
        }
    }

    const transports: any = [];
    const winstonConfig: WinstonConfig = <any> loggerConfig;
    var winstonTransports: WinstonTransportConfig[];

    if (config.environment === "development") {
        winstonTransports = winstonConfig.development.transports;
    }
    else if (config.environment === "production") {
        winstonTransports = winstonConfig.production.transports
    }

    for (const winstonTransport of winstonTransports) {
        transports.push(createTransport(winstonTransport));
    }

    export const logger = winston.createLogger({
        transports: transports
    });

    export const debug = logger.debug.bind(logger);
    export const verbose = logger.verbose.bind(logger);
    export const warn = logger.warn.bind(logger);
    export const info = logger.info.bind(logger);
    export const error = logger.error.bind(logger);

    export const child = logger.child.bind(logger);
}
