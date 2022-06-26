/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Dependency } from "../dependency";
import { Logger } from "../../logging";
import Agenda = require("agenda");
const Agendash = require('agendash');
import { Application } from "express";
import { JobProcessor } from "../../jobs/job-processor";

export class AgendaDependency extends Dependency<Agenda> {

    private agenda: Agenda;
    private isAgendash: boolean;
    private isJobDefinitionsRegistered: boolean = false;

    // Mongo host
    constructor(protected host: string, isAgendash: boolean, ) {
        super(
            host
        );
        this.isAgendash = isAgendash;
    }

    public async connect(): Promise<Agenda> {
        return new Promise(async (resolve, reject) => {
            const options = {
                defaultConcurrency: 5, // Takes a number which specifies the default number of a specific job that can be running at any given moment. (Default=5)
                maxConcurrency: 20, // Takes a number which specifies the max number of jobs that can be running at any given moment. (Default=20)
                defaultLockLimit: 0, // Takes a number which specifies the default number of a specific job that can be locked at any given moment. (Default=0 for no max)
                lockLimit: 0, //Takes a number which specifies the max number jobs that can be locked at any given moment. (Default=0 for no max)
                defaultLockLifetime: 600000, // Takes a number which specifies the default lock lifetime in milliseconds. (Default=600000 for 10 minutes)
                db: { // Specifies that Agenda should connect to MongoDB.
                    address: this.host, // The MongoDB connection URL.
                    collection: "agendajobs", // The name of the MongoDB collection to use. (Default=agendaJobs)
                    options: { // Connection options to pass to MongoDB. (Options: http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html)
                        useNewUrlParser: true,
                        useUnifiedTopology: true, // new topology engine (No longer relevant: autoReconnect, reconnectTries and reconnectInterval)
                        //autoIndex: false, // Don't automatically build indexes,
                        poolSize: 10, // The maximum size of the individual server pool. (Default: 5)
                        //Sets a cap on how many operations the driver will buffer up before giving up on getting a working connection. (Default:-1 for unlimited).
                        //bufferMaxEntries: 0 // 0: If not connected, return errors immediately rather than waiting for reconnect
                    }
                }
            };

            try {
                this.agenda = new Agenda(options);

                // Job Queue Events
                // Called just before a job starts
                this.agenda.on("start", job => {
                    Logger.info(`Job ${job.attrs.name} starting`);
                });
                // Called when a job finishes successfully
                this.agenda.on("success", job => {
                    Logger.info(`Job ${job.attrs.name} Successful`);
                });
                // Called when a job throws an error
                this.agenda.on("fail", (err, job) => {
                    Logger.error(`Job ${job.attrs.name} failed with error: ${err.message}`);
                    Logger.info(job);
                });

                // Called when Agenda mongo connection process has thrown an error
                this.agenda.on("error", (err) => {
                    Logger.error(`${this.getName()} error: ${err.message}`);

                    // TODO: Test this...
                    // this.disconnected.bind(this)
                });

                // Called when Agenda mongo connection is successfully opened and indices created.
                this.agenda.on("ready", async () => {
                    Logger.info(`${this.getName()} ready.`);
                    // Register job definitions
                    //for (let jobProcessor of this.jobProcessors) {
                    //    this.agenda.define(jobProcessor.getJobName(), jobProcessor.process);
                    //}

                    // Starts the job queue processing
                    //await this.agenda.start();

                    Logger.info(`${this.getName()} connected.`);
                    this.connected();

                    resolve(this.agenda);
                });

            } catch (error) {
                Logger.error(`${this.getName()} connection unsuccessful`);
                this.disconnected();
                reject(error);
            }
        });
        //return this.agenda;
    }

    public async registerJobDefinitions(...jobProcessors: JobProcessor[]) {
        // Register job definitions
        for (let jobProcessor of jobProcessors) {
            Logger.info(`Registering job processor: ${jobProcessor.getJobName()}.`);
            this.agenda.define(jobProcessor.getJobName(), jobProcessor.process);
        }
        this.isJobDefinitionsRegistered = true;
    }

    public async removeUndefinedBehaviourJobs() : Promise<void> {
        Logger.info(`Starting remove undefined behaviour jobs.`);
        if (this.isJobDefinitionsRegistered) {
            // Removes all jobs in the database without defined behaviors. Useful if you change a definition name and want to remove old jobs. 
            // Returns a Promise resolving to the number of removed jobs, or rejecting on error.
            const numRemoved = await this.agenda.purge();
            Logger.info(`Removed ${numRemoved} undefined old jobs.`);
        }
        else {
            Logger.info(`Agenda purge not called as no job definitions have been registered. This is to prevent the job collection from being destroyed.`);
        }
    }

    public async start() : Promise<void> {
        // Starts the job queue processing
        Logger.info(`Starting job queue processing.`);
        await this.agenda.start();
    }

    public async getClient(): Promise<Agenda> {
        return this.agenda;
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
        return "Agenda";
    }

    public addAgendash(app: Application) {
        // Agendash UI
        if (this.isAgendash) {
            app.use('/agendash', Agendash(this.agenda));
        }
    }

}
