/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as jwt from "jsonwebtoken";
import config from '../../config';

export class JWT {
    public constructor(protected userId: string) {
    }

    public createToken(): string{
        const expiresIn = '7d';
        const payload = {
            sub: this.userId,
            // https://www.npmjs.com/package/jsonwebtoken#token-expiration-exp-claim
            // Numeric date (in seconds)
            iat: Date.now() / 1000,
            iss: config.jwtIssuer,
            aud: config.jwtAudience
        };

        return jwt.sign(payload, config.jwtSecret, { expiresIn: expiresIn, algorithm: 'HS512' });
    }
}
