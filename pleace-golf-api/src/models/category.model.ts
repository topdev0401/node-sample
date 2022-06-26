import * as mongoose from "mongoose";
export type CategoryModel = mongoose.Document & Category;

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

export const CategorySchema = mongoose.model<CategoryModel>("category", categorySchema);


export class Category {
    _id: string;
    name: string;
}