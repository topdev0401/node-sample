/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { ErrorType } from "./error-type.enum";

export class ErrorCondition<T> {
    private instance: T;
    private internalError: string;
    private externalError: string;
    private errorType: ErrorType | Function;
    private errorCondition: (i: T) => boolean = () => { return false; };

    constructor(instance: T, condition: (i: T) => boolean, internalError: string, externalError: any, errorType: ErrorType | Function) {
        this.instance = instance;
        this.internalError = internalError;
        this.errorCondition = condition;
        this.externalError = externalError;
        this.errorType = errorType;
    }

    IsTrue() { return this.errorCondition(this.instance); }
    InternalError() { return this.internalError; }
    ExternalError() { return this.externalError; }
    ErrorType() { return this.errorType; }
}
