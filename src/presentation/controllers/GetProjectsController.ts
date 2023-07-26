import type GetProjects from '../../application/usecases/GetProjects';
import Cache from '../../infra/Cache';
import type UsecaseFactory from '../../infra/factories/UsecaseFactory';
import type Controller from '../protocols/Controller';

export default class GetProjectsController implements Controller {
  private readonly getProjects: GetProjects;

  constructor(private readonly usecaseFactory: UsecaseFactory) {
    this.getProjects = this.usecaseFactory.createGetProjects();
  }

  handle = async (): Promise<Output[]> => {
    const key = 'projects';
    if (Cache.has(key)) return Cache.get(key);
    console.debug('Getting data from GitHub API...');
    const timeStart = new Date().getTime();
    const output = await this.getProjects.execute();
    Cache.set(key, output);
    const timeEnd = new Date().getTime();
    console.log(`Getting data from GitHub API took ${timeEnd - timeStart} ms`);
    return output;
  };
}

interface Output {
  name: string;
  description: string;
  url: string;
  technologies: string[];
  members: Array<{
    name: string;
    github: string;
    linkedin: string;
    twitter: string;
    site: string;
  }>;
}
