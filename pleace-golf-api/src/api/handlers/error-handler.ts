import { Request, Response } from "express";
import { Logger } from "../../core/logging";
import { ErrorWriter } from "../../core/errors/error-writer";

export function handleErrors(err: any, req: Request, res: Response, next: any) {
    Logger.error(err);

    if (res.headersSent) {
        return next(err);
    }

    ErrorWriter.writeErrorResponse(err, res);
}

export function wrapAsyncWithErrorHandling(callback: Function, callbackObject: object) {
    return async function(req: any, res: any, next: any){
        try {
            await callback.apply(callbackObject, [req, res, next]);
        } catch (err) {
            Logger.error(err);
            next(err);
        }
    };
}
