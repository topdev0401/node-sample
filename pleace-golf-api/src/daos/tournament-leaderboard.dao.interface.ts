import { DAO } from "../core/dao/dao.interface";
import { TournamentLeaderboard } from "../types/tournament-leaderboard";
import { GolfDivision } from "../types/golf-division.enum";

/**
 * Represents data access for tournament leaderboard.
 *
 * @interface
 */
export interface TournamentLeaderboardDAO extends DAO<TournamentLeaderboard> {

    /**
    * Updates leaderboard
    * @async
    * @param  {string} userID User ID
    * @param  {string} tournamentID Tournament ID
    * @param  {string} courseID Course ID
    * @param  {number} total Total to update
    * @param  {number} holes Holes to update
    * @param  {number} round1 Round1 to update
    * @returns {Promise<TournamentLeaderboard>} Returns a promise for the updated TournamentLeaderboard object
    */
    updateLeaderboard(userID: string, tournamentID: string, courseID: string, total: number, holes: number, round1: number): Promise<TournamentLeaderboard>;

    /**
    * Get leaderboard
    * @async
    * @param  {string} tournamentID Tournament ID
    * @param  {GolfDivision} division Golf division
    * @returns {Promise<TournamentLeaderboard[]>} Returns a promise for the TournamentLeaderboard list
    */
    getLeaderboard(tournamentID: string, division?: GolfDivision): Promise<TournamentLeaderboard[]>;

    /**
    * Updates any field in leadership.
    * @async
    * @param  {TournamentLeaderboard} tournamentLeaderboard 
    * @returns {Promise<TournamentScorecard>} Returns a promise for the updated TournamentScorecard object
    */
     updateAny(tournamentLeaderboard: TournamentLeaderboard): Promise<TournamentLeaderboard>;
}
