/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { MongoDAO } from "./mongo.dao";
import * as mongoose from "mongoose";

export class BasicMongoDAO<T> extends MongoDAO<T> {

    constructor(objectSchema: mongoose.Model<mongoose.Document & T>) {
        super(objectSchema);
    }

    public async update(object: T): Promise<T> {
        throw new Error("Not implemented.");
    }

    public async search(inputQuery: string, limit: number): Promise<T[]> {
        throw new Error("Not implemented.");
    }
}
