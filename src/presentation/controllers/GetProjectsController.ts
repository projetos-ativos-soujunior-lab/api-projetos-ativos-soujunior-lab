import type GetProjects from '../../application/usecases/GetProjects';
import Cache from '../../infra/Cache';
import type UsecaseFactory from '../../infra/factories/UsecaseFactory';
import type Controller from '../protocols/Controller';
import type HttpResponse from '../protocols/HttpResponse';
import ResponseEntity from '../protocols/ResponseEntity';
export default class GetProjectsController implements Controller {
  private readonly getProjects: GetProjects;

  constructor(private readonly usecaseFactory: UsecaseFactory) {
    this.getProjects = this.usecaseFactory.createGetProjects();
  }

  handle = async (): Promise<HttpResponse> => {
    try {
      const key = 'projects';
      if (Cache.has(key)) return Cache.get(key);
      console.debug('Getting data from GitHub API...');
      const timeStart = new Date().getTime();
      const projects = await this.getProjects.execute();
      Cache.set(key, projects);
      const timeEnd = new Date().getTime();
      console.log(`Getting data from GitHub API took ${timeEnd - timeStart} ms`);
      return ResponseEntity.ok(projects);
    } catch (e: any) {
      console.error(e);
      return ResponseEntity.serverError({ error: e.message });
    }
  };
}
