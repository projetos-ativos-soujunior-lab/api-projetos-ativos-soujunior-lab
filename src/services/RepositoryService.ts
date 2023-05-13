import { GitHub } from '../infra/api/GitHub';
import { type Repository } from '../infra/providers/Repository';

export class RepositoryService {
  private readonly topic = 'soujunior-lab';

  public readonly getRepositories = async (): Promise<Repository[]> => {
    try {
      const data = await GitHub.api(`search/repositories?q=topic:${this.topic}&type=repositories&per_page=100`);
      const repositories: Repository[] = data.items.filter(
        (repository: Repository) => !this.isForkAndArchived(repository)
      );
      return repositories;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  public readonly getRepositoryLanguages = async (repository: Repository): Promise<string> => {
    try {
      const languages = await GitHub.api(`${repository.languages_url}`);
      return Object.keys(languages).join(', ');
    } catch (e) {
      console.error(e);
      return '';
    }
  };

  private readonly isForkAndArchived = (repository: Repository): boolean => {
    return repository.fork && repository.archived;
  };
}
