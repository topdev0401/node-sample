import { User } from "./user";
import { GolfDivision } from "./golf-division.enum";

export class TournamentLeaderboard {
    _id: string;
    user: User;
    tournamentId: string;
    courseId: string;
    division: GolfDivision;
    total: number;
    holes: number;
    round1: number;
    teamName?: string;
}