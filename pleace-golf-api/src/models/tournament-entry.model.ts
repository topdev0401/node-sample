import * as mongoose from "mongoose";
import { TournamentEntry } from "../types/tournament-entry";
import { GolfDivision } from "../types/golf-division.enum";
import { Gender } from "../types/gender.enum";

export type TournamentEntryModel = mongoose.Document & TournamentEntry;

const tournamentEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GolfCourse',
        required: true
    },
    scorecardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TournamentScorecard',
        required: true
    },
    leaderboardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TournamentLeaderboard',
        required: true
    },
    division: {
        type: GolfDivision,
        required: true
    },
    handicapIndex: {
        type: Number,
        required: true
    },
    tee: {
        type: String,
        required: true
    },
    gender: {
        type: Gender,
        required: true
    },
    teamName: {
        type: String
    },
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const TournamentEntrySchema = mongoose.model<TournamentEntryModel>("TournamentEntry", tournamentEntrySchema);