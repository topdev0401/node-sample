import * as mongoose from "mongoose";
export type LinkNameModel = mongoose.Document & LinkName;

const linkNameSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const LinkNameSchema = mongoose.model<LinkNameModel>("linkname", linkNameSchema);


export class LinkName {
    _id: string;
    name: string;
}