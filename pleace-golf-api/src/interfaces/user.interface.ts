import { AccountStatus } from "../types/account-status.enum";
import { Gender } from "../types/gender.enum";
import { GolfDivision } from "../types/golf-division.enum";

export interface IUser {
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
    isAdmin: boolean;
    amateurTokens? : string[];
    links?: object[];
}
