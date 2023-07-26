import 'dotenv/config';
import GetProjectsCron from './infra/cron/GetProjectsCron';
import GitHubAdapter from './infra/external/api/GitHubAdapter';
import UsecaseFactory from './infra/factories/UsecaseFactory';
import ExpressAdapter from './infra/http/ExpressAdapter';
import FetchAdapter from './infra/http/FetchAdapter';
import GetProjectsController from './presentation/controllers/GetProjectsController';

const main = (): void => {
  const port = process.env.PORT ?? 5001;
  const httpClient = new FetchAdapter();
  const usecaseFactory = new UsecaseFactory(new GitHubAdapter(httpClient));
  const getProjectsController = new GetProjectsController(usecaseFactory);
  const server = new ExpressAdapter();

  const getProjectsCron = new GetProjectsCron(usecaseFactory);
  getProjectsCron.start();

  server.on('get', '/api/v1/projects', getProjectsController.handle);

  server.listen(port as number);
};

main();
