/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */


export class ValidationError extends Error { }

export class ReferenceNotFoundError extends Error { }

export class InternalError extends Error { }

export class EmptyOrNullError extends Error { }

export class AuthenticationError extends Error { }

export class ExistsError extends Error { }

export class DoesNotExistError extends Error {
    //public message = "No such user exists.";
}

export class InvalidCodeError extends Error { }