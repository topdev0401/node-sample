/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { ErrorType } from "./error-type.enum";
import { InternalError, EmptyOrNullError, ExistsError, AuthenticationError, DoesNotExistError, ReferenceNotFoundError, InvalidCodeError } from "./errors";
import { Logger } from "../logging";

export class ErrorBuilder {
    static generate(error: ErrorType | Function, message?: string): Error {
        Logger.info("generate");
        if (typeof error === "function") {
            const errorFn = error as Function;
            errorFn(message);
        } else {
            const errorType = error as ErrorType;
            switch (errorType) {
                case ErrorType.ReferenceNotFound:
                    return new ReferenceNotFoundError(message);
                case ErrorType.Range:
                    return new RangeError(message);
                case ErrorType.Internal:
                    return new InternalError(message);
                case ErrorType.EmptyOrNull:
                    return new EmptyOrNullError(message);
                case ErrorType.Exists:
                    return new ExistsError(message);
                case ErrorType.Authentication:
                    return new AuthenticationError(message);
                case ErrorType.DoesNotExist:
                    return new DoesNotExistError(message);
                case ErrorType.InvalidCode:
                    return new InvalidCodeError(message);
                case ErrorType.Generic:
                    return new Error(message);
                default:
                    return new Error(message);
            }
        }
    }

    static generateGeneric(message: string, innerErrorMessage?: string) {
        return new Error(`${message} InnerErrorMessage: ${innerErrorMessage}`);
    }
}
