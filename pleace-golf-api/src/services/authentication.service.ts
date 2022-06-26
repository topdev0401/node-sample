import { Logger } from "../core/logging";
import { JWT } from "../core/auth/jwt";

export class AuthenticationService {

    public constructor()
    {
    }

    /**
     * Login
     * @async
     * @returns Returns an access token for the user.
     */
    public async authenticateUser(userId: string): Promise<string> {

        Logger.info(`[AuthenticationService.authenticateUser] called. User: '${userId}'.`);

        return new JWT(userId).createToken();
    }

}
