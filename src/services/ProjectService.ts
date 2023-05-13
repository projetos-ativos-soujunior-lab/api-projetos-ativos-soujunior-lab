import { MemberMapper, type MemberDto } from '../domain/dtos/MemberDto';
import { type ProjectDto } from '../domain/dtos/ProjectDto';
import { type MemberService } from './MemberService';
import { type OrganizationService } from './OrganizationService';
import { type RepositoryService } from './RepositoryService';

export class ProjectService {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly repositoryService: RepositoryService,
    private readonly memberService: MemberService
  ) {}

  getProjects = async (): Promise<ProjectDto[]> => {
    console.debug('Getting data from GitHub API...');
    const repositories = await this.repositoryService.getRepositories();
    const organizations = await this.organizationService.getOrganizationsByName(
      repositories.map(repository => repository.owner.login)
    );
    const projects = await Promise.all(
      organizations.map(async organization => {
        const members: MemberDto[] = await MemberMapper.toDtos(await this.memberService.getMembers(organization));
        const languages: string[] = await this.organizationService.getOrganizationLanguages(
          repositories.filter(repository => repository.owner.login === organization.login)
        );
        return {
          name: organization.name ?? organization.login,
          url: organization.html_url,
          description: organization.description ?? '',
          members,
          languages,
        };
      })
    );
    return projects;
  };
}