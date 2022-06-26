import { GolfDivision } from "./golf-division.enum";
import { Gender } from "./gender.enum";

export class TournamentEntry {
    _id: string;
    userId: string;
    tournamentId: string;
    courseId: string;
    scorecardId: string;
    leaderboardId: string;
    division: GolfDivision;
    handicapIndex: number;
    tee: string;
    gender: Gender;
    teamName?: string;

}