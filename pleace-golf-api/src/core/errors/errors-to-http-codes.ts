/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { ErrorType } from "./error-type.enum";

const ErrorsToHTTPCodes = new Map(
    [
        ["Validation", 400],
        ["ReferenceNotFound", 400],
        ["Range", 400],
        ["Internal", 500],
        ["EmptyOrNull", 400],
        ["Authentication", 401],
        ["Exists", 400],
        ["DoesNotExist", 404],
        ["InvalidCode", 400],
        ["Generic", 500]
    ]);


export function getHTTPResponseCode(errorType: ErrorType): number {
    return ErrorsToHTTPCodes.get(errorType.toString());
}