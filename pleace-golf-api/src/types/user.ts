import { IUser } from "../interfaces/user.interface";
import { AccountStatus } from "./account-status.enum";
import { Gender } from "./gender.enum";
import { GolfDivision } from "./golf-division.enum";

export class User implements IUser {
    _id: string;
    email: string;
    password: string;
    status: AccountStatus;
    isConfirmed: boolean;
    emailVerificationCode?: string;
    resetPasswordVerificationCode?: string;
    firstName: string;
    lastName: string;
    nationality: string;
    countryOfResidence: string;
    state?: string;
    handicapIndex: number;
    homeClub?: string;
    gender?: Gender;
    division: GolfDivision;
    accessToken? :string;
    pgaMemberNumber? :string;
    isAdmin :boolean;
    amateurTokens? : string[];
    links? : object[];
    public static fromId(id: string): User {
        return {
            _id: id
        } as User;
    }
}