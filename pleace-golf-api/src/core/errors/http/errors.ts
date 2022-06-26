/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

export class BaseError extends Error {
    public errorCode: number;
    constructor(errorCode: number, message: string) {
        super(message);
        this.errorCode = errorCode;
    }
}

/**
 * Indicates that an action cannot be completed because of a bad request error.
 * The property field will contain the missing/invalid field and in the error message
 * there will be more information about it.
 */
export class BadRequestError extends BaseError {
    field: string;
    constructor(errorCode: number, message: string, field?: string) {
        super(errorCode, message);
        this.field = field;
    }
}

/**
 * Indicates that an action cannot be completed because of a conflict
 * with some business rule.
 *
 */
export class ConflictError extends BaseError {
    constructor(errorCode: number, message: string) {
        super(errorCode, message);
    }
}

/**
 * Indicates that an action cannot be completed because the user is not allowed.
 *
 */
export class ForbiddenError extends BaseError {
    constructor(errorCode: number, message: string) {
        super(errorCode, message);
    }
}

/**
 * Indicates that an action cannot be completed because of internal server error
 *
 */
export class InternalServerError extends BaseError {
    constructor(errorCode: number, message: string) {
        super(errorCode, message);
    }
}

/**
 * Indicates that an action cannot be completed because of Not found error.
 *
 */
export class NotFoundError extends BaseError {
    identifier: string;

    constructor(errorCode: number, message: string, identifier: string) {
        super(errorCode, message);
        this.identifier = identifier;
    }
}


export class PreconditionFailedError extends BaseError {
    constructor(errorCode: number, message: string) {
        super(errorCode, message);
    }
}


export class UnauthorizedError extends BaseError {
    constructor(errorCode: number, message: string) {
        super(errorCode, message);
    }
}
