import { User } from "./user";
import { Tournament } from "./tournament";
import { GolfDivision } from "./golf-division.enum";

export class TournamentResult {
    _id: string;
    user: User;
    tournament: Tournament;
    courseId: string;
    division: GolfDivision;
    total: number;
    holes: number;
    round1: number;
    score?: number;
    points?:number;
    bonusPoints?:number;
    avgIndex?:number;
}