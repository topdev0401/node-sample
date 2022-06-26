/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import config from '../../config';
import * as crypto from "crypto";

export class TokenGenerator {

    /**
    * Token generator
    * NOTE: used for email confirmation, password reset and access tokens.
    * @async
    * @param {number} length The length of the token to generate
    * @returns {Promise<string>} Returns promise of token
    */
    public static async generateToken(length: number): Promise<string> {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = new Array(length);

        return new Promise((resolve, reject) => {
            crypto.randomBytes(length, (err, bytes) => {
                if (err) {
                    reject(err);
                } else {

                    let cursor = 0;
                    for (var i = 0; i < length; i++) {
                        cursor += bytes[i];
                        result[i] = chars[cursor % chars.length];
                    }

                    resolve(result.join(''));
                }
            });
        });
    }
}