import * as mongoose from "mongoose";
import { GolfClub } from "../types/golf-club";
import { GolfClubMembership } from "../types/golf-club-membership.enum";

export type GolfClubModel = mongoose.Document & GolfClub;

const golfClubSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    membership: {
        type: GolfClubMembership,
        required: true
    },
    numberOfHoles: {
        type: Number,
        required: true
    },
    //  Alpha2 or subdivision code
    countryCode: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    website: {
        type: String
    },
    contactName: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    status: {
        type: Boolean
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const GolfClubSchema = mongoose.model<GolfClubModel>("GolfClub", golfClubSchema);
