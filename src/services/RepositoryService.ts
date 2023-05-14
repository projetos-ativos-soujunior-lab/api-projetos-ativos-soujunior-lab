import { Technology } from '../domain/models/Technology';
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

  getRepositoryLanguages = async (repository: Repository): Promise<string[]> => {
    try {
      const key = `repository-${repository.id}-languages`;
      if (Cache.has(key)) return Cache.get(key);
      const data = await GitHub.api(`${repository.url}/languages`);
      const languages = Object.keys(data);
      Cache.set(key, languages);
      return languages;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getRepositoryTopics = async (repository: Repository): Promise<string[]> => {
    try {
      const key = `repository-${repository.id}-topics`;
      if (Cache.has(key)) return Cache.get(key);
      const data = await GitHub.api(`${repository.url}/topics`);
      const topics = data.names;
      Cache.set(key, topics);
      return topics;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getRepositoryTechnologies = async (repository: Repository): Promise<string[]> => {
    const languages = await this.getRepositoryLanguages(repository);
    const topics = await this.getRepositoryTopics(repository);
    const technologies = [...new Set([...languages, ...topics.filter(Technology.isTech)])];
    return technologies;
  };

  private readonly isForkAndArchived = (repository: Repository): boolean => {
    return repository.fork && repository.archived;
  };
}
