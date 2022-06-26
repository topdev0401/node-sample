import * as mongoose from "mongoose";
import { Tournament } from "../types/tournament";
import { GolfDivision } from "../types/golf-division.enum";

export type TournamentModel = mongoose.Document & Tournament;

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    regStartDate: {
        type: Date
    },
    regEndDate: {
        type: Date
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    maxPlayers: {
        type: Number,
        default:''
    },
    divisions: [
        {
            type: String,
            enum: Object.values(GolfDivision),
            required: true
        }
    ],
    type : {
        type : String
    },
    courses: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'GolfCourse',
                required: true
            },
            numberOfHoles: {
                type: Number,
                required: true
            },
            group: {
                size: {
                    type: Number,
                    required: true
                },
                maxGroups: {
                    type: Number,
                    required: true
                }
            }
        }
    ],
    isResultProcessed: {
        type: Boolean,
        required: true,
        default: false
    },
    challengers : {
        type: Array
    },
    createdBy : {
        type : String
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const TournamentSchema = mongoose.model<TournamentModel>("Tournament", tournamentSchema);