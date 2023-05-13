import { type Request, type Response } from 'express';
import { type ProjectService } from '../services/ProjectService';

export class ConsolidateController {
  constructor(private readonly projectService: ProjectService) {}

  getData = async (_req: Request, res: Response): Promise<Response> => {
    const projects = await this.projectService.getProjects();
    return res.json(projects);
  };
}
