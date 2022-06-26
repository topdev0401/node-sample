/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Request, Response, NextFunction } from "express";
import * as expressWinston from "express-winston";
import * as flat from "flat";
import * as _ from "lodash";
import { Logger } from "../logging";


/**
 * Responsible for defining the obfuscation logic.
 * - '*' character - Obfuscate every char of the orig object property with '*'
 * - '#' character - Obfuscate the entire string of the orig object property with a single '#'
 * - '!' value - Blacklist the property, removing it entirely from the resulting object
 * Numbers, arrays and objects are obfuscated to a single '#'
 *
 * For example, the following request...
 * {
 *  "url": "/api/users",
 *  "headers": {
 *      "authorization": "aaaaa-bbbbb-ccccc-dddd-123456"
 *  },
 *  "body": {
 *      "userDetails": {
 *          "username": "john.snow@got.com",
 *          "password": "password",
 *          "gender": "male",
 *          "age": 17
 *      },
 *  }
 * }
 *
 * ... with the following obfRules object...
 * {
 *  "headers": {
 *      "authorization": "*"
 *  },
 *  "body": {
 *      "userDetails": {
 *          "username": "*",
 *          "password": "#",
 *          "gender": "!",
 *          "age": "*"
 *      }
 *  }
 * }
 *
 * ... will result in the following object log:
 * {
 *  "url": "/api/users",
 *  "headers": {
 *      "authorization": "*****************************"
 *  },
 *  "body": {
 *      "userDetails": {
 *          "username": "*****************",
 *          "password": "#",
 *          "age": "#"
 *      }
 *  }
 * }
 */
const _obfRules = {
    "headers": {
        "authorization": "*", // Obfuscate every char of 'headers.authorization' in the orig object with '*'
    },
    "body": {
        "userDetails": {
            "username": "*",
            "password": "#", // Obfuscate the entire string from 'body.userDetails.password' with a single '#'
            "notificationsToken": "*",
            "restorationCode": "*"
        },
        "restorationCode": "#",
        "password": "#",
        "accessToken": "*",
        "refreshToken": "*",
        "securityCode": "*",
        "oldPassword": "#",
        "oldRestorationCode": "#",
        "newPassword": "#",
        "applicant": {
            "dob": "*",
        },
        "addresses": "#",
    }
};

export interface LogMiddlewareOptions {
    /** Properties to log from the request:
     * @default ["url", "headers", "method", "httpVersion", "originalUrl", "query", "body"]
     */
    reqFilter?: Array<string>;
    /** Properties to log from the response:
     * @default ["statusCode", "body"]
     */
    resFilter?: Array<string>;
    /** Ignore requests on the following routes:
     * @default ["docs"]
     */
    ignoreRoute?: Array<string>;
    /**
     * Enable/disable obfuscation on properties.
     * @default false
     */
    obfuscate?: boolean;
}

const defaults: LogMiddlewareOptions = {
    reqFilter: ["url", "headers", "method", "httpVersion", "originalUrl", "query", "body"],
    resFilter: ["statusCode", "body"],
    ignoreRoute: ["docs"],
    obfuscate: false
};

/**
 * Logs request/response objects. Allows for obfuscation of request/response objects.
 *
 * @param options - Specify which properties to log from the request/response.
 * @param obfRules - Specify which properties to obfuscate. Only applies if 'obfuscate' is set to true.
 */
export function initialize(options: LogMiddlewareOptions = defaults, obfRules: Object = _obfRules) {
    options = _.merge({}, defaults, options);

    return (req: Request, res: Response, next: NextFunction) => {
        logRequest(req, options, obfRules); // Manually log the request immediately.
        return logWinstonResponse(req, res, next, options, obfRules); // Use 'express-winston' for logging the response.
    };
}

function logRequest(req: Request, options: LogMiddlewareOptions, obfRules: Object): void {
    if (!_.some(options.ignoreRoute, (u) => req.originalUrl.includes(u))) {
        const filteredRequest = _
            .chain(req)
            .pick(options.reqFilter)
            .cloneDeep()
            .value();
        const meta = options.obfuscate ? obfuscateObject(filteredRequest, obfRules) : filteredRequest;
        /* Logger.info({
            meta,
            message: "Request started."
        }); */
        Logger.info({
            message: "Request started."
        });
    }
}

function logWinstonResponse(req: Request, res: Response, next: NextFunction, options: LogMiddlewareOptions, obfRules: Object) {
    return expressWinston.logger({
        winstonInstance: Logger.logger,
        requestFilter: () => { return undefined; }, // We do not care about logging the request again with the response
        responseWhitelist: options.resFilter,
        responseFilter: (res, propName) => {
            return options.obfuscate ? obfuscateObject(_.cloneDeep(res), obfRules)[propName] : res[propName];
        },
        dynamicMeta: (req) => { return { requestId: req.body.requestId }; }, // Add requestId in the response if present
        ignoreRoute: (req) => { return _.some(options.ignoreRoute, (u) => req.originalUrl.includes(u)); }
    })(req, res, next);
}

export function obfuscateObject(orig: Object, rules: Object): any {
    const singleCharObf = "#";
    const multipleCharObf = "*";
    return _.reduce(_.keys(flat(rules)), (prev, ruleKey): any => {
        const origValue = _.get(prev, ruleKey);

        // No such field exists in the orig object or it is an empty string. Return without mutating.
        if (origValue === undefined || origValue === "") {
            return prev;
        }

        const ruleValue = _.get(rules, ruleKey, singleCharObf);
        // Blacklist fields with value "!"
        if (ruleValue === "!") {
            return _.omit(prev, ruleKey);
        }

        // Obfuscate strings with chars per every element depending on rule value
        if (_.isString(origValue)) {
            const parsed = ruleValue === multipleCharObf ? origValue.replace(/./g, multipleCharObf) : singleCharObf;
            return _.set(prev, ruleKey, parsed);
        }

        // Obfuscate numbers, booleans, objects and arrays with a single char.
        return _.set(prev, ruleKey, singleCharObf);
    }, orig);
}