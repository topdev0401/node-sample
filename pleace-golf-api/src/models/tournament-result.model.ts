import * as mongoose from "mongoose";
import { TournamentResult } from "../types/tournament-result";
import { GolfDivision } from "../types/golf-division.enum";

export type TournamentResultModel = mongoose.Document & TournamentResult;

const tournamentResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tournament: {
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
    score: {
        type:Number
    },
    points: {
        type:Number
    },
    bonusPoints: {
        type:Number
    },
    avgIndex: {
        type:Number
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const TournamentResultSchema = mongoose.model<TournamentResultModel>("TournamentResult", tournamentResultSchema);