import { Router } from 'express';
import { ProjectController } from './controllers/ProjectController';
import { MemberService } from './services/MemberService';
import { OrganizationService } from './services/OrganizationService';
import { ProjectService } from './services/ProjectService';
import { RepositoryService } from './services/RepositoryService';

const routes = Router();

const memberService = new MemberService();
const repositoryService = new RepositoryService();
const organizationService = new OrganizationService(repositoryService);

const projectService = new ProjectService(organizationService, repositoryService, memberService);

routes.get('/projects', new ProjectController(projectService).getData);

export default routes;
