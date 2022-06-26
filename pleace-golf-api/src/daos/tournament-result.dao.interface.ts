import { DAO } from "../core/dao/dao.interface";
import { TournamentResult } from "../types/tournament-result";
import { GolfDivision } from "../types/golf-division.enum";
import { Ranking } from "../types/ranking";

/**
 * Represents data access for tournament result.
 *
 * @interface
 */
export interface TournamentResultDAO extends DAO<TournamentResult> {

    /**
    * Get ranking
    * @async
    * @param  {string[]} countryCodes Country codes
    * @param  {GolfDivision} division Golf division
    * @returns {Promise<TournamentResult[]>} Returns a promise for the Ranking list
    */
    getRanking(countryCodes: string[], division: GolfDivision): Promise<Ranking[]>;

    /**
    * Get tournament results
    * @async
    * @param  {string} tournamentId Tournament Id
    * @param  {GolfDivision} division Golf division
    * @returns {Promise<TournamentResult[]>} Returns a promise for the TournamentResult list
    */
    getTournamentResults(tournamentId: string, division: GolfDivision): Promise<TournamentResult[]>;

    /**
    * Get all tournament results
    * @async
    * @param  {GolfDivision} division Golf division
    * @returns {Promise<TournamentResult[]>} Returns a promise for the TournamentResult list
    */
    getAllTournamentResults(division: GolfDivision): Promise<TournamentResult[]>;
}
