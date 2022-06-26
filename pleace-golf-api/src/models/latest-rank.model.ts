
import * as mongoose from "mongoose";
export type LatestRankModel = mongoose.Document & LatestRank;

const latestRankSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    nationality: {
        type: String,
    },
    position: {
        type: Number,
    },
    totalPoints: {
        type: Number,
    },
    division: {
        type: String
    },
    rounds: {
        type: Number
    }
});

export const LatestRankSchema = mongoose.model<LatestRankModel>("latestrank",latestRankSchema);


export class LatestRank {
    _id: string;
    name: string;
    totalPoints: number;
    position : number;
    countryCode : string;
    division:string;
    rounds : number;
}