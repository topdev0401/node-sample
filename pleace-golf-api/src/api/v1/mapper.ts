import { IUser } from "../../interfaces/user.interface";
import { Country } from "../../core/country/country";
import * as response from "./dtos/response";
import * as dto from "./dtos";
import * as _ from "lodash";
import { GolfClub } from "../../types/golf-club";
import { Tournament } from "../../types/tournament";
import { GolfCourse } from "../../types/golf-course";
import { TournamentGolfCourse } from "../../types/tournament-golf-course";
import { TournamentEntry } from "../../types/tournament-entry";
import { TournamentScorecard } from "../../types/tournament-scorecard";
import { TournamentLeaderboard } from "../../types/tournament-leaderboard";
import { TournamentResult } from "../../types/tournament-result";
import { Ranking } from "../../types/ranking";
import { Logger } from "../../core/logging";
import { GolfTee } from "../../types/golf-tee";
import { Gender } from "../../types/gender.enum";
import { ObjectId } from "mongodb";

export class Mapper {

    public static mapUserToUserProfile(user: IUser): response.UserProfileResponse {
        return {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            nationality: user.nationality,
            countryOfResidence: user.countryOfResidence,
            state: user.state,
            handicapIndex: user.handicapIndex,
            homeClub: user.homeClub,
            gender: user.gender,
            accountStatus: user.status,
            division: user.division,
            isAdmin : user.isAdmin,
            links: user.links
        };
    }

    public static mapCountry(country: Country): response.CountryResponse {
        return {
            name: country.name,
            nationality: country.nationality,
            hasSubdivision: country.hasSubdivision,
            code: country.getCode(),
            isState : country.isState ? country.isState : false
        };
    }

    public static mapCountries(countries: Country[]): response.CountryResponse[] {
        return _.map(countries, this.mapCountry);
    }

    public static mapGolfClub(golfClub: GolfClub): response.GolfClubResponse {
        return {
            clubId: golfClub._id,
            name: golfClub.name
        };
    }

    public static mapGolfClubs(golfClubs: GolfClub[]): response.GolfClubResponse[] {
        return _.map(golfClubs, this.mapGolfClub);
    }

    public static mapGolfTee(golfTee: GolfTee): dto.GolfTee {
        return {
            _id: golfTee._id,
            name: golfTee.name,
            gender: golfTee.gender,
            courseRating: golfTee.courseRating,
            slopeRating: golfTee.slopeRating,
            par: golfTee.par,
            holes: golfTee.holes
        };
    }

    public static mapGolfTees(golfTees: GolfTee[]): dto.GolfTee[] {
        return _.map(golfTees, this.mapGolfTee.bind(this));
    }

    public static mapGolfCourse(golfCourse: GolfCourse,teeId:string, tee: string, gender: Gender): response.GolfCourseResponse {

        let tees = this.mapGolfTees(golfCourse.tees);
        let filteredTees = _.filter(tees, (golfTee) => {
            return golfTee._id == teeId;
        });
        if(filteredTees?.length === 0) {
            filteredTees = _.filter(tees, (golfTee) => {
                return golfTee.name === tee && golfTee.gender === gender;
            });
        }
        if(filteredTees?.length === 0) {
            filteredTees = tees;
        }
        return {
            courseId: golfCourse._id,
            name: golfCourse.name,
            tees: this.mapGolfTees(filteredTees)
        };
    }

    public static mapTournamentGolfCourse(tournamentGolfCourse: TournamentGolfCourse): response.GolfCourseResponse {
        return {
            courseId: tournamentGolfCourse.course._id,
            name: tournamentGolfCourse.course.name,
            tees: this.mapGolfTees(tournamentGolfCourse.course.tees),
            clubId:  tournamentGolfCourse.course.clubId,
            clubName : tournamentGolfCourse.course.clubName
        };
    }


    public static mapTournamentGolfCourses(tournamentGolfCourses: TournamentGolfCourse[]): response.GolfCourseResponse[] {
        return _.map(tournamentGolfCourses, this.mapTournamentGolfCourse.bind(this));
    }

    public static mapTournament(tournament: Tournament): response.TournamentResponse {
        return {
            tournamentId: tournament._id,
            name: tournament.name,
            regStartDate: tournament.regStartDate.toISOString(),
            regEndDate: tournament.regEndDate.toISOString(),
            startDate: tournament.startDate.toISOString(),
            endDate: tournament.endDate.toISOString(),
            divisions: tournament.divisions,
            courses: this.mapTournamentGolfCourses(tournament.courses),
            type : tournament?.type,
            maxPlayers: tournament.maxPlayers,
            challengers: tournament.challengers,
            createdBy: tournament.createdBy
        };
    }

    public static mapTournaments(tournaments: Tournament[]): response.TournamentResponse[] {
        return _.map(tournaments, this.mapTournament.bind(this));
    }

    public static mapTournamentEntry(tournamentEntry: TournamentEntry): response.TournamentEntryResponse {
        return {
            tournamentId: tournamentEntry.tournamentId,
            courseId: tournamentEntry.courseId,
            scorecardId: tournamentEntry.scorecardId,
            leaderboardId: tournamentEntry.leaderboardId,
            handicapIndex: tournamentEntry.handicapIndex,
            tee: tournamentEntry.tee
        };
    }

    public static mapTournamentScorecard(tournamentScorecard: TournamentScorecard, tee: string, gender: Gender): response.TournamentScorecardResponse {
        return {
            scorecardId: tournamentScorecard._id,
            tournamentId: tournamentScorecard.tournamentId,
            course: this.mapGolfCourse(tournamentScorecard.course,tournamentScorecard.teeId, tee, gender),
            scores: tournamentScorecard.scores,
            courseIndex: tournamentScorecard.courseIndex,
            tee: tournamentScorecard.tee,
            teeId: tournamentScorecard.teeId,
            handicapIndex: tournamentScorecard.handicapIndex,
            teamName : tournamentScorecard.teamName
        };
    }

    public static mapTournamentLeaderboard(tournamentLeaderboard: TournamentLeaderboard): response.TournamentLeaderboardResponse {
        return {
            position: 0,
            name: tournamentLeaderboard.user?.firstName + " " + tournamentLeaderboard.user?.lastName,
            countryCode: tournamentLeaderboard.user?.nationality,
            total: tournamentLeaderboard.total,
            holes: tournamentLeaderboard.holes,
            round1: tournamentLeaderboard.round1,
            userId: tournamentLeaderboard.user._id,
            division: tournamentLeaderboard.division
        };
    }

    public static mapTournamentLeaderboardView(tournamentLeaderboard: any): response.TournamentLeaderboardResponse {
        return {
            position: 0,
            name: tournamentLeaderboard.user?.firstName + " " + tournamentLeaderboard.user?.lastName,
            countryCode: tournamentLeaderboard.user?.nationality,
            total: tournamentLeaderboard.total,
            holes: tournamentLeaderboard.holes,
            round1: tournamentLeaderboard.round1,
            userId: tournamentLeaderboard.user._id,
            division: tournamentLeaderboard.division,
            gender: tournamentLeaderboard.user?.gender,
            courseId : tournamentLeaderboard.courseId?._id,
            courseName : tournamentLeaderboard.courseId?.name,
            clubId : tournamentLeaderboard.courseId?.clubId?._id,
            clubName : tournamentLeaderboard.courseId?.clubId?.name,
            teamName: tournamentLeaderboard.teamName
        };
    }

    public static mapTournamentLeaderboards(tournamentLeaderboards: TournamentLeaderboard[]): response.TournamentLeaderboardResponse[] {
        return _.map(tournamentLeaderboards, (tournamentLeaderboard, i) => {
            return _.extend(this.mapTournamentLeaderboard(tournamentLeaderboard), { position: i + 1 });
        });
    }

    public static mapTournamentLeaderboardsView(tournamentLeaderboards:any[]): response.TournamentLeaderboardResponse[] {
        return _.map(tournamentLeaderboards, (tournamentLeaderboard, i) => {
            return _.extend(this.mapTournamentLeaderboardView(tournamentLeaderboard), { position: i + 1 });
        });
    }

    public static mapTournamentToResultSummary(tournament: Tournament): response.TournamentResultSummaryResponse {
        return {
            tournamentId: tournament._id,
            startDate: tournament.startDate.toISOString(),
            endDate: tournament.endDate.toISOString(),
            name: tournament.name,
            type : tournament.type
        };
    }

    public static mapTournamentsToResultSummaries(tournamentResults: Tournament[]): response.TournamentResultSummaryResponse[] {
        return _.map(tournamentResults, this.mapTournamentToResultSummary);
    }

    public static mapTournamentResult(tournamentResult: TournamentResult): response.TournamentResultResponse {
        return {
            tournamentId: tournamentResult.tournament._id,
            position: 0,
            countryCode: tournamentResult.user.nationality,
            playerName: tournamentResult.user.firstName + " " + tournamentResult.user.lastName,
            total: tournamentResult.total,
            holes: tournamentResult.holes,
            round1: tournamentResult.round1,
            division: tournamentResult.division,
            points : tournamentResult.points,
            bonusPoints : tournamentResult.bonusPoints,
            totalPoints : tournamentResult.points + tournamentResult.bonusPoints
        };
    }

    public static mapTournamentResults(tournamentResults: TournamentResult[]): response.TournamentResultResponse[] {
        return _.map(tournamentResults, (tournamentResult, i) => {
            return _.extend(this.mapTournamentResult(tournamentResult), { position: i + 1 });
        });
    }

    public static mapRanking(ranking: Ranking): response.RankingResponse {
        return {
            user : ranking.user._id,
            position: 0,
            name: ranking.user.firstName + " " + ranking.user.lastName,
            countryCode: ranking.user.nationality,
            totalPoints: ranking.totalPoints,
            rounds : ranking.rounds
        };
    }

    public static mapRankings(rankings: Ranking[]): response.RankingResponse[] {
        return _.map(rankings, (ranking, i) => {
            return _.extend(this.mapRanking(ranking), { position: i + 1 });
        });
    }

    public static mergeCurrentExistingRanking(currentRanking:[],existingRanking:[]) : response.RankingResponse[] {

        return null;
    }

}