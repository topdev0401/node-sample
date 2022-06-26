import { Gender } from "./gender.enum";
import { GolfDivision } from "./golf-division.enum";

export class UserRegistrationForm {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    nationality: string;
    countryOfResidence: string;
    state?: string;
    handicapIndex: number;
    accessToken?: string;
    pgaMemberNumber?: string;
    division?: GolfDivision;
    homeClub?: string;
    gender?: Gender;
}