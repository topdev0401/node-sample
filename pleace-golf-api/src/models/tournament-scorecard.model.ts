import * as mongoose from "mongoose";
import { TournamentScorecard } from "../types/tournament-scorecard";
import { GolfDivision } from "../types/golf-division.enum";
import { Gender } from "../types/gender.enum";

export type TournamentScorecardModel = mongoose.Document & TournamentScorecard;

const tournamentScorecardSchema = new mongoose.Schema({
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
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GolfCourse',
        required: true
    },
    division: {
        type: GolfDivision,
        required: true
    },
    scores: [
        {
            hole: {
                type: Number,
                required: true
            },
            score: {
                type: Number,
                required: true
            },
            points: {
                type: Number
            }
        }
    ],
    handicapIndex: {
        type: Number,
        required: true
    },
    courseIndex: {
        type: Number,
        required: true
    },
    tee: {
        type: String,
        required: true
    },
    teeId: {
        type: String,
        required: true
    },
    gender: {
        type: Gender,
        required: true
    },
    teamName: {
        type: String
    }

}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const TournamentScorecardSchema = mongoose.model<TournamentScorecardModel>("TournamentScorecard", tournamentScorecardSchema);