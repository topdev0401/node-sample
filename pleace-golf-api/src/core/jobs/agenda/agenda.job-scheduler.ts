/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import Agenda = require("agenda");
import { IJobScheduler } from "../job-scheduler.interface";
import { Logger } from "../../logging";

export class AgendaJobScheduler implements IJobScheduler{

    public constructor(protected agenda: Agenda) {
    }

    public getName(): string {
        return "AgendaJobScheduler";
    }

    public now(jobName: string, data?: object): Promise<Agenda.Job<object>> {
        return this.agenda.now(jobName, data);
    }
    // https://github.com/agenda/human-interval
    public schedule(when: string, jobName: string, data?: object): Promise<Agenda.Job<object>> {
        return this.agenda.schedule(when, jobName, data);
    }
    // interval can be a human-readable format String, a cron format String, or a Number
    // options.timezone: should be a string as accepted by moment-timezone and is considered when using an interval in the cron string format.
    // options.skipImmediate: true | false (default) Setting this true will skip the immediate run.The first run will occur only in configured interval.
    public every(interval: string, jobName: string, data?: object, options?: object): Promise<Agenda.Job<object>> {
        return this.agenda.every(interval, jobName, data, options);
    }
}
