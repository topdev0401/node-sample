/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { ErrorType } from "../error-type.enum";

const ErrorsToCodes = new Map(
    [
        ["BadRequestError", 400],
        ["UnauthorizedError", 401],
        ["ForbiddenError", 403],
        ["NotFoundError", 404],
        ["ConflictError", 409],
        ["PreconditionFailedError", 412],
        ["InternalServerError", 500],

    ]);


export function getResponseStatus(errorType: ErrorType): number {
    return ErrorsToCodes.get(errorType.toString());
}
