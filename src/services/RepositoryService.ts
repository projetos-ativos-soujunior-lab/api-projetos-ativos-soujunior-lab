import { Cache } from '../infra/Cache';
import { GitHub } from '../infra/api/GitHub';
import { type Repository } from '../infra/providers/Repository';

export class RepositoryService {
  private readonly topic = 'soujunior-lab';

  getRepositories = async (): Promise<Repository[]> => {
    try {
      const key = `repositories-${this.topic}`;
      if (Cache.has(key)) return Cache.get(key);
      const data = await GitHub.api(`search/repositories?q=topic:${this.topic}&type=repositories&per_page=100`);
      const repositories: Repository[] = data.items.filter(
        (repository: Repository) => !this.isForkAndArchived(repository)
      );
      Cache.set(key, repositories);
      return repositories;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getRepositoryLanguages = async (repository: Repository): Promise<string> => {
    try {
      const key = `repository-${repository.id}-languages`;
      if (Cache.has(key)) return Cache.get(key);
      const data = await GitHub.api(`${repository.languages_url}`);
      const languages = Object.keys(data).join(', ');
      Cache.set(key, languages);
      return languages;
    } catch (e) {
      console.error(e);
      return '';
    }
  };

  private readonly isForkAndArchived = (repository: Repository): boolean => {
    return repository.fork && repository.archived;
  };
}
