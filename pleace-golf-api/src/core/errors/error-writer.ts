/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Response } from "express";
import { ErrorType } from "./error-type.enum";
import { getHTTPResponseCode } from "./errors-to-http-codes";
import { ErrorBuilder } from "./error-builder";
import { Logger } from "../logging";

export class ErrorWriter {

    static writeErrorTypeResponse(errorType: ErrorType, errorMessage: string, res: Response): any {
        Logger.info("writeErrorTypeResponse");
        let httpResponseCode = getHTTPResponseCode(errorType);
        let error = ErrorBuilder.generate(errorType, errorMessage);
        let errorResponse = this.generateErrorResponse(errorType, error);
        res.status(httpResponseCode).json(errorResponse)
    }

    static writeErrorResponse(error: Error, res: Response): any {
        Logger.error(error);
        Logger.info("writeErrorResponse");
        let errorType = this.getErrorType(error);
        Logger.info("errorType1:" + errorType);
        let httpResponseCode = getHTTPResponseCode(errorType);
        let errorResponse = this.generateErrorResponse(errorType, error);
        res.status(httpResponseCode).json(errorResponse)
    }

    private static getErrorType(error: Error): ErrorType {
        var errorType: string;
        var errorName = error.constructor.name;
        Logger.info("errorName:" + errorName);
        Logger.info(error.message);
        Logger.info(error.stack);
        if (errorName === "Error") {
            errorType = ErrorType.Generic;
        }
        else {
            errorType = errorName.replace('Error', '');
        }
        Logger.info("errorType2:" + errorType);

        if (!ErrorType[errorType as keyof typeof ErrorType]) {
            errorType = ErrorType.Generic;
        }

        return ErrorType[errorType as keyof typeof ErrorType];
    }

    private static generateErrorResponse(errorType: ErrorType, err: Error): any {
        return {
            errorType: errorType,
            errorMessage: err.message,
        };
    }
}
