import * as mongoose from "mongoose";
export type InviteModel = mongoose.Document & Invite;

const inviteSchema = new mongoose.Schema({
    category: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    type: {
        type: String,
    },
    url: {
        type: String,
        unique: true
    },
    isUsed: {
        type: Boolean,
        default : false
    },
    stageName : {
        type:String
    },
    country : {
        type:String
    },
    usedBy : {
        type:String
    },
    isVerified: {
        type: Boolean
    },
    isSpecialInvitee: {
        type: Boolean,
        default:false
    },
    isDeclined: {
        type: Boolean,
        default:false
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const InviteSchema = mongoose.model<InviteModel>("invite",inviteSchema);


export class Invite {
    _id: string;
    category: string;
    firstName: string;
    lastName : string;
    type : string;
    url:string;
    isUsed : boolean;
    stageName:string;
    country:string;
    usedBy:string;
    isVerified:boolean;
    isSpecialInvitee:boolean;
    status : string;
}