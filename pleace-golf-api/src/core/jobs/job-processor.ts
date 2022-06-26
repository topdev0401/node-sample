/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { IJobDataExtractor } from "./job-data-extractor.interface";

export abstract class JobProcessor {
    constructor(protected jobDataExtractor: IJobDataExtractor) {
    }

    public abstract getJobName(): string;

    // Instance arrow function
    public abstract process = async (job: any): Promise<void> => { };
}
