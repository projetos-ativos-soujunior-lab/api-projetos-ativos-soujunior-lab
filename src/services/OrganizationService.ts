import { Cache } from '../infra/Cache';
import { GitHub } from '../infra/api/GitHub';
import { type Organization } from '../infra/providers/Organization';
import { type Repository } from '../infra/providers/Repository';
import { RepositoryService } from './RepositoryService';

export class OrganizationService {
  private readonly exclusionList: string[] = ['projetos-ativos-soujunior-lab', 'SouJunior'];

  getOrganizationByName = async (name: string): Promise<Organization | undefined> => {
    try {
      const key = `organization-${name}`;
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

  getOrganizationLanguages = async (repositories: Repository[]): Promise<string[]> => {
    const repositoryService = new RepositoryService();
    const languages: string[] = await Promise.all(
      repositories.map(async (repository: Repository) => await repositoryService.getRepositoryLanguages(repository))
    );
    const allLanguages: string[] = languages.map((language: string) => language.split(', ')).flat();
    return [...new Set(allLanguages.filter((language: string) => language !== ''))];
  };

  private readonly isOrganization = (organization: Organization): boolean => {
    return organization.type === 'Organization';
  };

  private readonly removeOrganizations = (names: string[]): string[] => {
    return names.filter((name: string) => !this.exclusionList.includes(name) && name !== '');
  };
}
