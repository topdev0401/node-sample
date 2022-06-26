import { DAO } from "../core/dao/dao.interface";
import { Tournament } from "../types/tournament";

/**
 * Represents data access for tournament.
 *
 * @interface
 */
export interface TournamentDAO extends DAO<Tournament> {

    /**
    * Get tournament
    * @async
    * @returns {Promise<Tournament[]>} Returns a promise for the Tournament
    */
    getTournament(tournamentId: string): Promise<Tournament>;

    /**
    * Get available tournaments
    * @async
    * @returns {Promise<Tournament[]>} Returns a promise for the Tournament list
    */
    getAvailableTournaments(): Promise<Tournament[]>;

    /**
    * Get available tournaments
    * @async
    * @param {string} tournamentID Tournament id
    * @returns {Promise<void>} Returns a promise
    */
    markTournamentAsProcessed(tournamentID: string): Promise<void>;


}
