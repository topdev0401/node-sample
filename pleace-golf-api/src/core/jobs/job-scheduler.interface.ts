/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import Agenda = require("agenda");

export interface IJobScheduler {
    getName(): string;

    // Schedules a job to run job name once immediately.
    now(jobName: string, data?: object): Promise<object>;
    // https://github.com/agenda/human-interval
    // Schedules a job to run name once at a given time.
    schedule(when: string, jobName: string, data?: object): Promise<object>;
    // Runs job name at the given interval
    every(interval: string, jobName: string, data?: object, options?: object): Promise<object>;
}
