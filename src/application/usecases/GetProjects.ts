import Project from '../../domain/entities/Project';
import type GitHub from '../../infra/external/api/GitHub';

export default class GetProjects {
  private readonly topic = 'soujunior-lab';

  constructor(private readonly api: GitHub) {}

  execute = async (): Promise<Output[]> => {
    const repos = await this.api.getReposByTopic(this.topic);
    const orgs = await this.api.getOrgsByName(repos.map(repo => repo.owner.login));
    console.debug(`Found ${orgs.length} organizations`);
    const projects = await Promise.all(
      orgs.map(async org => {
        const members = await this.api.getMembersByOrg(org);
        const languages = await this.api.getOrgLanguages(org);
        const topics = await this.api.getOrgTopics(org);
        return await Project.builder(org, languages, topics, members);
      })
    );
    return Project.filter(projects);
  };
}

interface Output {
  name: string;
  description: string;
  url: string;
  technologies: string[];
  members: Array<{
    name: string;
    github: string;
    linkedin: string;
    twitter: string;
    site: string;
  }>;
}
