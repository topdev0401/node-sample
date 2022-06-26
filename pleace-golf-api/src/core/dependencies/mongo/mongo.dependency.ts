/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import * as mongoose from "mongoose";
import { Dependency } from "../dependency";
import { Logger } from "../../logging";

export class MongoDBDependency extends Dependency<mongoose.Mongoose> {

    constructor(protected host: string) {
        super(
            host
        );
    }

    public async connect(): Promise<mongoose.Mongoose> {
        //return new Promise(async (resolve, reject) => {
            const db = mongoose.connection;

            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true, // new topology engine (No longer relevant: autoReconnect, reconnectTries and reconnectInterval)
                autoIndex: false, // Don't automatically build indexes
                poolSize: 10, // Maintain up to 10 socket connections
                // If not connected, return errors immediately rather than waiting for reconnect
                bufferMaxEntries: 0
            };

            try {
                await mongoose.connect(this.host, options);
                Logger.info(`${this.getName()} connected.`);
                this.connected();
                db.once("disconnected", this.disconnected.bind(this));
                //return resolve(mongoose);
            } catch (error) {
                Logger.error(`${this.getName()} connection unsuccessful`);
                this.disconnected();
                //return reject(error);
            }

            return mongoose;
        //});
    }

    public async getClient(): Promise<mongoose.Mongoose> {
        return mongoose;
    }

    disconnected() {
        try {
            this.connect.bind(this);
        } catch (error) {
            Logger.error(error);
        }
    }

    connected() {
    }

    getName() {
        return "MongoDB";
    }
}
