import { Score } from "./score";
import { GolfDivision } from "./golf-division.enum";
import { GolfCourse } from "./golf-course";
import { Gender } from "./gender.enum";

export class TournamentScorecard {
    _id: string;
    userId: string;
    tournamentId: string;
    course: GolfCourse;
    division: GolfDivision;
    scores: Score[];
    handicapIndex: number;
    courseIndex: number;
    tee: string;
    gender: Gender;
    teeId: string;
    teamName?: string;
}