import { Logger } from "../core/logging";
import { ErrorBuilder } from "../core/errors/error-builder";
import { ErrorType } from "../core/errors/error-type.enum";
import { ErrorMessage } from "../types/error-message.enum";
import { DAO } from "../core/dao/dao.interface";
import { GolfClub } from "../types/golf-club";
import { FilterBuilder } from "../core/dao/filter/filter-builder";

export class GolfClubService {

    private readonly golfClubDAO: DAO<GolfClub>;

    public constructor(golfClubDAO: DAO<GolfClub>)
    {
        this.golfClubDAO = golfClubDAO;
    }

    /**
     * Get Golf Clubs
     * @async
     * @param {string} countryCode Alpha 2 country code or subdivision code
     * @returns {Promise<GolfClub[]>} List of golf clubs.
     */
    public async getGolfClubs(countryCode: string): Promise<GolfClub[]> {
        try {
            const filters = new FilterBuilder()
                .addFilter("countryCode", countryCode)
                .buildAll();
            const golfClubs = await this.golfClubDAO.getMultipleByFilters(filters);
            //const golfClubs = await this.golfClubDAO.searchByProperty("countryCode", countryCode, 10);
            return Promise.resolve(golfClubs);
        } catch (error) {
            Logger.error(error);
            return Promise.reject(ErrorBuilder.generate(ErrorType.Generic, error));
        }
    }
}
