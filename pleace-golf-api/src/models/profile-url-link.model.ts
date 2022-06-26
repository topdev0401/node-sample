import * as mongoose from "mongoose";
import { ProfileUrlLink } from "../types/profile-url-link";

export type ProfileUrlLinkModel = mongoose.Document & ProfileUrlLink;

const profileUrlLinkSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // linkNameId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'linkname',
    //     required: true
    // },
    linkName: {
        type:String,
        required: true
    },
    linkUrl: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const ProfileUrlLinkSchema = mongoose.model<ProfileUrlLinkModel>("TournamentEntry", profileUrlLinkSchema);