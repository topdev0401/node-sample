import * as mongoose from "mongoose";
export type CelebrityTypeModel = mongoose.Document;

const celebrityTypeSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name : {
        type: String,
    }
});
export const CelebrityTypeSchema = mongoose.model<CelebrityTypeModel>("celebritytype",celebrityTypeSchema);





