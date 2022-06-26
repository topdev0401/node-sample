import { Logger } from "../core/logging";
import { JobProcessor } from "../core/jobs/job-processor";
import { IJobDataExtractor } from "../core/jobs/job-data-extractor.interface";
import { Job } from "./job.enum";
import { EmailService } from "../core/email/email-service";
import { EmailTemplateFactory } from "../email/email-template-factory";
import config from '../config';

export class NotifyClubsUpdateCourseJobProcessor extends JobProcessor {
    private readonly emailService: EmailService;

    constructor(jobDataExtractor: IJobDataExtractor, emailService: EmailService) {
        super(jobDataExtractor);
        this.emailService = emailService;
    }

    public getJobName(): string{
        return Job.NotifyClubsUpdateCourseJob;
    }

    public process = async (job: any): Promise<void> => {
        var jobData = this.jobDataExtractor.extractDataFromJob(job);
        const clubEmailArr:any[] = jobData.clubInfo;
        for(let i=0; i<clubEmailArr.length; i++) {
            const clubEmailInfo = clubEmailArr[i];
            if(this.emailService.validateEmailAddress(clubEmailInfo.clubEmail)) {
                const golfClubPageUrl = config.app.getGolfClubPageUrl(clubEmailInfo.clubId);
                clubEmailInfo['golfClubPageUrl'] = golfClubPageUrl;
                const emailTemplate = EmailTemplateFactory.createNotifyClubTemplate(clubEmailInfo);
                await this.emailService.sendMail(emailTemplate,Job.NotifyClubsUpdateCourseJob);
            }
        }
    }

    
}
