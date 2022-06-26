import { Logger } from "../core/logging";
import { JobProcessor } from "../core/jobs/job-processor";
import { IJobDataExtractor } from "../core/jobs/job-data-extractor.interface";
import { TournamentManagementService } from "../services/tournament-management.service";
import { Job } from "./job.enum";

export class TournamentResultJobProcessor extends JobProcessor {
    private readonly tournamentManagementService: TournamentManagementService;

    constructor(jobDataExtractor: IJobDataExtractor, tournamentManagementService: TournamentManagementService) {
        super(jobDataExtractor);
        this.tournamentManagementService = tournamentManagementService;
    }

    public getJobName(): string {
        return Job.TournamentResultJob;
    }

    private async processTournament(tournamentId: string): Promise<void> {
        await this.tournamentManagementService.createTournamentResults(tournamentId);
        await this.tournamentManagementService.markTournamentAsProcessed(tournamentId);
    }

    public process = async (job: any): Promise<void> => {
        var jobData = this.jobDataExtractor.extractDataFromJob(job);
        const unprocessedFinishedTournaments = await this.tournamentManagementService.getFinishedTournaments(false);
        Logger.info(`${unprocessedFinishedTournaments.length} unprocessed finished tournaments`);
        await unprocessedFinishedTournaments.reduce((accumulatorPromise, unprocessedFinishedTournament) => {
            return accumulatorPromise.then(() => {
                return this.processTournament(unprocessedFinishedTournament._id);
            });
        }, Promise.resolve());
    }
}
