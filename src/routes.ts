import { Router } from 'express';
import { ConsolidateController } from './controllers/ConsolidateController';
import { MemberService } from './services/MemberService';
import { OrganizationService } from './services/OrganizationService';
import { ProjectService } from './services/ProjectService';
import { RepositoryService } from './services/RepositoryService';

const routes = Router();

const organizationService = new OrganizationService();
const repositoryService = new RepositoryService();
const memberService = new MemberService();

const projectService = new ProjectService(organizationService, repositoryService, memberService);

routes.get('/consolidate', new ConsolidateController(projectService).getData);

export default routes;
