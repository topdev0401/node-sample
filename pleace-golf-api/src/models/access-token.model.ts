import * as mongoose from "mongoose";
import { GolfDivision } from "../types/golf-division.enum";
import { AccessToken } from "../types/access-token";
export type AccessTokenModel = mongoose.Document & AccessToken;

const accessTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    golfDivision: {
        type: GolfDivision,
        required: true
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const AccessTokenSchema = mongoose.model<AccessTokenModel>("AccessToken", accessTokenSchema);
