import { Cache } from '../infra/Cache';
import { GitHub } from '../infra/api/GitHub';
import { type Member } from '../infra/providers/Member';
import { type Organization } from '../infra/providers/Organization';
import { type Repository } from '../infra/providers/Repository';
import { type MemberService } from './MemberService';
import { type RepositoryService } from './RepositoryService';

export class OrganizationService {
  private readonly exclusionList: string[] = ['projetos-ativos-soujunior-lab', 'SouJunior'];

  constructor(private readonly repositoryService: RepositoryService, private readonly memberService: MemberService) {}

  getOrganizations = async (): Promise<Organization[]> => {
    const repositories = await this.repositoryService.getRepositories();
    const organizations = await this.getOrganizationsByName(repositories.map(repository => repository.owner.login));
    return organizations;
  };

  getOrganizationsByName = async (names: string[]): Promise<Organization[]> => {
    const organizations: Organization[] = [];
    const noRepeatOrganizations = new Set(names);
    const namesOrganizations = this.removeOrganizations(Array.from(noRepeatOrganizations));
    for (const name of namesOrganizations) {
      const organization = await this.getOrganizationByName(name);
      if (organization !== undefined) organizations.push(organization);
    }
    return organizations;
  };

  getOrganizationByName = async (name: string): Promise<Organization | undefined> => {
    try {
      const key = `${name}`;
      if (Cache.has(key)) return Cache.get(key);
      const organization: Organization = await GitHub.api(`orgs/${name}`);
      if (this.isOrganization(organization)) {
        Cache.set(key, organization);
        return organization;
      }
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  getOrganizationRepositories = async (organization: Organization): Promise<Repository[]> => {
    try {
      const key = `${organization.id}-repositories`;
      if (Cache.has(key)) return Cache.get(key);
      const repositories: Repository[] = await GitHub.api(`orgs/${organization.login}/repos`);
      Cache.set(key, repositories);
      return repositories;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getOrganizationMembers = async (organization: Organization): Promise<Member[]> => {
    try {
      const key = `${organization.id}-members`;
      if (Cache.has(key)) return Cache.get(key);
      if (organization.members_url == null) return [];
      const members_url: string = organization.members_url.replace('{/member}', '');
      const members: Member[] = await GitHub.api(`${members_url}`);
      if (members == null) return [];
      const membersWithDetails: Member[] = [];
      for (const member of members) {
        const memberWithDetails: Member | undefined = await this.memberService.getMember(member.url);
        if (memberWithDetails != null) membersWithDetails.push(memberWithDetails);
      }
      Cache.set(key, membersWithDetails);
      return membersWithDetails;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getOrganizationTechnologies = async (organization: Organization): Promise<string[]> => {
    const repositories = await this.getOrganizationRepositories(organization);
    const technologies: string[] = [];
    for (const repository of repositories) {
      const repositoryTechnologies = await this.repositoryService.getRepositoryTechnologies(repository);
      technologies.push(...repositoryTechnologies);
    }
    return [...new Set(technologies)];
  };

  private readonly isOrganization = (organization: Organization): boolean => {
    return organization.type === 'Organization';
  };

  private readonly removeOrganizations = (names: string[]): string[] => {
    return names.filter((name: string) => !this.exclusionList.includes(name) && name !== '');
  };
}
