import type GetProjects from '../../application/usecases/GetProjects';
import Cache from '../Cache';
import type UsecaseFactory from '../factories/UsecaseFactory';
import CronAdapter from './CronAdapter';

export default class GetProjectsCron {
  private readonly getProjects: GetProjects;

  constructor(private readonly usecaseFactory: UsecaseFactory) {
    this.getProjects = this.usecaseFactory.createGetProjects();
  }

  start = (): void => {
    CronAdapter.schedule(() => {
      const key = 'projects';
      console.debug('Cron Job: Checking if data is in cache...');
      if (!Cache.has(key)) {
        console.debug('Cron Job: Getting data from GitHub API...');
        const timeStart = new Date().getTime();
        this.getProjects
          .execute()
          .then(projects => {
            Cache.set(key, projects);
            const timeEnd = new Date().getTime();
            console.log(`Getting data from GitHub API took ${timeEnd - timeStart} ms`);
          })
          .catch(error => {
            console.error(`Error getting data from GitHub API: ${(error as Error).message}`);
          });
      }
    });
  };
}
