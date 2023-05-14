import { MemberMapper, type MemberDto } from '../domain/dtos/MemberDto';
import { type ProjectDto } from '../domain/dtos/ProjectDto';
import { Cache } from '../infra/Cache';
import { type Organization } from '../infra/providers/Organization';
import { type OrganizationService } from './OrganizationService';

export class ProjectService {
  constructor(private readonly organizationService: OrganizationService) {}

  getProjects = async (): Promise<ProjectDto[]> => {
    const timeStart = new Date().getTime();
    try {
      const key = 'projects';
      if (Cache.has(key)) return Cache.get(key);
      const organizations = await this.getOrganizations();
      const projects = await Promise.all(
        organizations.map(async organization => {
          const members: MemberDto[] = await this.getMembers(organization);
          const technologies: string[] = await this.getTecnologies(organization);
          return {
            name: organization.name ?? organization.login,
            url: organization.html_url,
            description: organization.description ?? '',
            technologies,
            members,
          };
        })
      );
      Cache.set(key, projects);
      const timeEnd = new Date().getTime();
      console.log(`Getting data from GitHub API took ${timeEnd - timeStart} ms`);
      return projects;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getProject = async (organization: Organization): Promise<ProjectDto> => {
    try {
      const key = `${organization.id}`;
      if (Cache.has(key)) return Cache.get(key);
      const project: ProjectDto = await Promise.resolve({
        name: organization.name ?? organization.login,
        url: organization.html_url,
        description: organization.description ?? '',
        technologies: (await this.getTecnologies(organization)) ?? [],
        members: (await this.getMembers(organization)) ?? [],
      });
      Cache.set(key, project);
      return project;
    } catch (e) {
      console.error(e);
      return {
        name: organization.name ?? organization.login,
        url: organization.html_url,
        description: organization.description ?? '',
        technologies: [],
        members: [],
      };
    }
  };

  private readonly getOrganizations = async (): Promise<Organization[]> => {
    return await this.organizationService.getOrganizations();
  };

  private readonly getMembers = async (organization: Organization): Promise<MemberDto[]> => {
    return await MemberMapper.toDtos(await this.organizationService.getOrganizationMembers(organization));
  };

  private readonly getTecnologies = async (organization: Organization): Promise<string[]> => {
    return await this.organizationService.getOrganizationTechnologies(organization);
  };
}
