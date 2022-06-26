/**
 * Copyright (c) 2020 Codev Technologies (Pty) Ltd. All rights reserved.
 */

import { Logger } from "../../logging";
import { IJobDataExtractor } from "../job-data-extractor.interface";

export class AgendaJobDataExtractor implements IJobDataExtractor{
    public extractDataFromJob(job: any): any {
        return job ? job.attrs.data : job;
    }
}
