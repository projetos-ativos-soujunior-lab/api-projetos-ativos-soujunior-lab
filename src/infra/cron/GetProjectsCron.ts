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
    CronAdapter.schedule(async () => {
      const key = 'projects';
      console.debug('Cron Job: Checking if data is in cache...');
      if (!Cache.has(key)) {
        console.debug('Getting data from GitHub API...');
        const timeStart = new Date().getTime();
        const projects = await this.getProjects.execute();
        Cache.set(key, projects);
        const timeEnd = new Date().getTime();
        console.log(`Getting data from GitHub API took ${timeEnd - timeStart} ms`);
      }
    });
  };
}
