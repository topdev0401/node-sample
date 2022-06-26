import { GolfDivision } from "./golf-division.enum";

export class AccessToken {
    _id: string;
    token: string;
    golfDivision: GolfDivision;
}