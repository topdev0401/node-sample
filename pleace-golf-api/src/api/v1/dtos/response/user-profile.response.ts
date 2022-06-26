import { AccountStatus } from "../../../../types/account-status.enum";
import { Gender } from "../../../../types/gender.enum";
import { GolfDivision } from "../../../../types/golf-division.enum";

/**
 * @swagger
 * definitions:
 *  UserProfileResponse:
 *      type: object
 *      properties:
 *          userId:
 *              type: string
 *          email:
 *              type: string
 *          firstName:
 *              type: string
 *          lastName:
 *              type: string
 *          nationality:
 *              type: string
 *          countryOfResidence:
 *              type: string
 *          handicapIndex:
 *              type: number
 *          homeClub:
 *              type: string
 *          gender:
 *              type: string
 *              enum: [MALE, FEMALE]
 *          accountStatus:
 *              type: string
 *              enum: [ACTIVE, INACTIVE, DISABLED]
 *          division:
 *              type: string
 *              enum: [Champ, Celebrity, Professional Golfer]
 */
export class UserProfileResponse {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    nationality: string;
    countryOfResidence: string;
    state: string;
    handicapIndex: number;
    homeClub?: string;
    gender?: Gender;
    accountStatus: AccountStatus;
    division: GolfDivision;
    isAdmin : boolean;
    links?: object[];
}