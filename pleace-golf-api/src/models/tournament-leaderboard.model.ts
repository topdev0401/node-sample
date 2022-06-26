import * as mongoose from "mongoose";
import { TournamentLeaderboard } from "../types/tournament-leaderboard";
import { GolfDivision } from "../types/golf-division.enum";

export type TournamentLeaderboardModel = mongoose.Document & TournamentLeaderboard;

const tournamentLeaderboardSchema = new mongoose.Schema({
    user: {
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
    division: {
        type: GolfDivision,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    holes: {
        type: Number,
        required: true
    },
    round1: {
        type: Number,
        required: true
    },
    teamName: {
        type: String
    }

}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const TournamentLeaderboardSchema = mongoose.model<TournamentLeaderboardModel>("TournamentLeaderboard", tournamentLeaderboardSchema);