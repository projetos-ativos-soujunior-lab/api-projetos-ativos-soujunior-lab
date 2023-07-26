import GetProjects from '../../application/usecases/GetProjects';
import type GitHub from '../external/api/GitHub';

export default class UsecaseFactory {
  constructor(private readonly api: GitHub) {}

  createGetProjects = (): GetProjects => {
    return new GetProjects(this.api);
  };
}
