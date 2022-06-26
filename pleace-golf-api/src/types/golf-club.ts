import { GolfClubMembership } from "./golf-club-membership.enum";

export class GolfClub {
    _id: string;
    code: string;
    name: string;
    membership: GolfClubMembership;
    numberOfHoles: number;

    address: string;
    city: string;
    state: string;
    countryCode: string;
    postalCode?: string;

    phone: string;
    fax?: string;
    website?: string;
    contactName?: string;
    contactTitle?: string;
    email?: string;

    isDrivingRange: boolean;
    isPuttingGreen: boolean;
    isChippingGreen: boolean;
    isPracticeBunker: boolean;
    isMotorCart: boolean;
    isPullCart: boolean;
    isGolfClubsRental: boolean;
    isClubFitting: boolean;
    isProShop: boolean;
    isGolfLessons: boolean;
    isCaddieHire: boolean;
    isRestaurant: boolean;
    isReceptionHall: boolean;
    isChangingRoom: boolean;
    isLockers: boolean;
    isLodgingOnSite: boolean;
    status?:boolean;
}