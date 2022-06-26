import * as bcrypt from "bcrypt";
import * as mongoose from "mongoose";
import { User } from "../types/user";
import { AccountStatus } from "../types/account-status.enum";
import { Gender } from "../types/gender.enum";
import { GolfDivision } from "../types/golf-division.enum";
import { TournamentEntrySchema } from "./tournament-entry.model";
import { TournamentLeaderboardSchema } from "./tournament-leaderboard.model";
import { TournamentResultSchema } from "./tournament-result.model";
import { TournamentScorecardSchema } from "./tournament-scorecard.model";
import { Logger } from "../core/logging";

export type UserModel = mongoose.Document & User;

/*export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
};*/

//export interface UserModel extends User, Document { }


const userSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: AccountStatus,
        required: true,
        default: AccountStatus.Active
    },
    isConfirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    emailVerificationCode: {
        type: String
    },
    resetPasswordVerificationCode: {
        type: String
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    countryOfResidence: {
        type: String,
        required: true
    },
    state: {
        type: String,
    },
    handicapIndex: {
        type: Number,
        required: true
    },
    homeClub: {
        type: String
    },
    gender: {
        type: Gender
    },
    division: {
        type: GolfDivision,
        required: true,
        default: GolfDivision.Champ
    },
    pgaMemberNumber: {
        type : String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    amateurTokens : [
        {
            type: String
        }
    ],
    links: [
        {
            linkName: {
                type: String,
                required: true
            },
            linkUrl: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });


userSchema.pre("save", function save(next) {
    const user = this as UserModel;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err: any, salt: string) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err: any, hash: string) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});


userSchema.pre("remove", function(next) {
    TournamentEntrySchema.remove({ userId: this._id }).exec();
    TournamentLeaderboardSchema.remove({ user: this._id }).exec();
    TournamentResultSchema.remove({ user: this._id }).exec();
    TournamentScorecardSchema.remove({ userId: this._id }).exec();
    next();
});


/*
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};*/

export const UserSchema = mongoose.model<UserModel>("User", userSchema);
