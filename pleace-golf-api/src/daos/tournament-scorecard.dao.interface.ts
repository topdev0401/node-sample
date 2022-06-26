import { DAO } from "../core/dao/dao.interface";
import { TournamentScorecard } from "../types/tournament-scorecard";
import { Score } from "../types/score";
import { Gender } from "../types/gender.enum";

/**
 * Represents data access for tournament scorecard.
 *
 * @interface
 */
export interface TournamentScorecardDAO extends DAO<TournamentScorecard> {
    /**
    * Get scorecard
    * @async
    * @param  {string} userID User ID
    * @param  {string} scorecardID Scorecard ID
    * @returns {Promise<TournamentScorecard>} Returns a promise for the TournamentScorecard object
    */
    getScorecard(userID: string, scorecardID: string): Promise<TournamentScorecard>


    /**
    * Get scorecard
    * @async
    * @param  {string} userID User ID
    * @param  {string} tournamentID tournament ID
    * @returns {Promise<TournamentScorecard>} Returns a promise for the TournamentScorecard object
    */
     getPlayerScorecard(userID: string, tournamentID: string): Promise<TournamentScorecard>

    /**
    * Updates scorecard scores
    * @async
    * @param  {string} userID User ID
    * @param  {string} scorecardID Scorecard ID
    * @param  {Score[]} scores List of scores to update
    * @returns {Promise<TournamentScorecard>} Returns a promise for the updated TournamentScorecard object
    */
    updateScores(userID: string, scorecardID: string, scores: Score[]): Promise<TournamentScorecard>;

    /**
    * Updates any field in tournament.
    * @async
    * @param  {TournamentScorecard} tournamentScorecard User ID
    * @returns {Promise<TournamentScorecard>} Returns a promise for the updated TournamentScorecard object
    */
     updateAny(tournamentScorecard: TournamentScorecard): Promise<TournamentScorecard>;
}
