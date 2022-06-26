import { Server } from "./server";
import config from './config';
import { MongoDBDependency, DependencyBootstrapper } from "./core/dependencies";
import { AgendaDependency } from "./core/dependencies/agenda/agenda.dependency";


const runServer = async () => {

    const mongoDBDependency = new MongoDBDependency(config.mongoDbUri);

    //const agendaJobDataExtractor = new AgendaJobDataExtractor();
    //const userEmailVerificationJob = new UserEmailVerificationJobProcessor(agendaJobDataExtractor);
    //const tournamentResultJob = new TournamentResultJobProcessor(agendaJobDataExtractor);
    const agendaDependency = new AgendaDependency(config.mongoDbUri, true);
    //const agendaDependency = new AgendaDependency(config.mongoDbUri, true, userEmailVerificationJob, tournamentResultJob);

    const dependencyBootstrapper = new DependencyBootstrapper(mongoDBDependency, agendaDependency);
    await dependencyBootstrapper.bootstrap();
    
    //const agenda = await agendaDependency.getClient();
    //const agendaJobScheduler = new AgendaJobScheduler(agenda);
    //await agendaJobScheduler.now("UserEmailVerificationJob");

    const server: Server = new Server(agendaDependency);
    await server.init();
    server.start();
};

runServer();
