/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Request, Response } from "express";
import { Logger } from "../logging";
import { ErrorType } from "../errors/error-type.enum";
import { ValidationErrorMessage } from "../../types/validation-error-message.enum";
import { CountryService } from "../country/country-service";
const { check, validationResult } = require('express-validator');
const countryService = new CountryService();
import * as mongoose from "mongoose";

export function validate(req: Request, res: Response, next: any) {
    const errors = validationResult(req).array();
    const len = errors.length;

    if (len === 0) {
        next();
    } else {
        const result: any[] = [];

        for (let i = 0; i < len; i++) {
            let field = errors[i].param;
            field = field.split(".").pop();

            result.push({
                errorType: ErrorType.Validation,
                errorMessage: errors[i].msg,
                field: field
            });
        }
        let resultErrors = {
            errors: result
        }
        Logger.error(resultErrors);

        res.status(400).json(resultErrors);
    }
}

export const CheckUserIdInPathMatchJWT = [
    check("userId")
    .custom((value: string, { req }: { req: Request }) => {
        if (req.user.sub !== value) {
            return Promise.reject();
        }
        return true;
    })
];

export function checkCountry(field: string) {
    return check(field).exists({ checkFalsy: true }).isIn(countryService.getCountryCodes());
}

export function checkCountryOptional(field: string) {
    return check(field).optional({ checkFalsy: true }).isIn(countryService.getCountryCodes());
}

export function checkString(field: string) {
    return check(field).exists({ checkFalsy: true }).isString();
}

export function checkId(field: string) {
    // .isMongoId
    return check(field).exists({ checkFalsy: true }).custom((value: string) => {
        try {
            mongoose.Types.ObjectId(value);
            return true;
        }
        catch (e) {
            // Override default mongoose error (too specific): Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
            return Promise.reject();
        }
    });
}

export function checkUserIdInPathMatchJWT() {
    return check("userId")
        .custom((value: string, { req }: { req: Request }) => {
            if (req.user.sub !== value) {
                return Promise.reject();
            }
            return true;
        });
}
