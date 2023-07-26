import Cache from '../../Cache';
import type HttpClient from '../../http/HttpClient';
import { type Language } from '../dto/Language';
import type Member from '../dto/Member';
import type Organization from '../dto/Organization';
import type Repository from '../dto/Repository';
import type Topic from '../dto/Topic';
import type GitHub from './GitHub';

export default class GitHubAdapter implements GitHub {
  private readonly token = process.env.GITHUB_TOKEN as string;
  private readonly baseUrl = 'https://api.github.com';

  constructor(private readonly httpClient: HttpClient) {}

  getReposByTopic = async (topic: string): Promise<Repository[]> => {
    try {
      const url = `${this.baseUrl}/search/repositories?q=topic:${topic}&type=repositories&per_page=100`;
      const data = await this.httpClient.get<{ items: Repository[] }>(url, this.setToken());
      const repos = data.items;
      console.debug(`Found ${repos.length} repositories with topic "${topic}"`);
      return this.filterRepos(repos);
    } catch (e: any) {
      console.error({ message: e.message });
      return [];
    }
  };

  getRepoLanguages = async (repo: Repository): Promise<string[]> => {
    try {
      const key = `${repo.id}-languages`;
      if (Cache.has(key)) return Cache.get(key);
      const url = `${repo.url}/languages`;
      const data = await this.httpClient.get<Language>(url, this.setToken());
      const languages = Object.keys(data);
      Cache.set(key, languages);
      return languages;
    } catch (e: any) {
      console.error({ message: e.message });
      return [];
    }
  };

  getRepoTopics = async (repo: Repository): Promise<string[]> => {
    try {
      const key = `${repo.id}-topics`;
      if (Cache.has(key)) return Cache.get(key);
      const url = `${repo.url}/topics`;
      const data = await this.httpClient.get<Topic>(url, this.setToken());
      const topics = data.names;
      Cache.set(key, topics);
      return topics;
    } catch (e: any) {
      console.error({ message: e.message });
      return [];
    }
  };

  getOrgByName = async (name: string): Promise<Organization> => {
    try {
      const url = `${this.baseUrl}/orgs/${name}`;
      const org = await this.httpClient.get<Organization>(url, this.setToken());
      return org;
    } catch (e: any) {
      console.error({ message: e.message });
      return null as unknown as Organization;
    }
  };

  getOrgsByName = async (names: string[]): Promise<Organization[]> => {
    const orgs: Organization[] = [];
    const setNames = [...new Set(names)];
    for (const name of setNames) {
      const org = await this.getOrgByName(name);
      if (org !== undefined) orgs.push(org);
    }
    return this.filterOrgs(orgs);
  };

  getOrgRepos = async (org: Organization): Promise<Repository[]> => {
    try {
      const key = `${org.id}-repos`;
      if (Cache.has(key)) return Cache.get(key);
      const url = `${this.baseUrl}/orgs/${org.login}/repos`;
      const repos = await this.httpClient.get<Repository[]>(url, this.setToken());
      Cache.set(key, repos);
      return repos;
    } catch (e: any) {
      console.error({ message: e.message });
      return [];
    }
  };

  getOrgLanguages = async (org: Organization): Promise<string[]> => {
    const repos = await this.getOrgRepos(org);
    const languages: string[] = [];
    for (const repo of repos) {
      const repoLanguages = await this.getRepoLanguages(repo);
      languages.push(...repoLanguages);
    }
    return languages;
  };

  getOrgTopics = async (org: Organization): Promise<string[]> => {
    const repos = await this.getOrgRepos(org);
    const topics: string[] = [];
    for (const repo of repos) {
      const repoTopics = await this.getRepoTopics(repo);
      topics.push(...repoTopics);
    }
    return topics;
  };

  getMembersByOrg = async (org: Organization): Promise<Member[]> => {
    try {
      const key = `${org.id}-members`;
      if (Cache.has(key)) return Cache.get(key);
      if (org.members_url == null) return [];
      const url = org.members_url.replace('{/member}', '');
      const members = await this.httpClient.get<Member[]>(url, this.setToken());
      if (members == null) return [];
      const membersDetails: Member[] = [];
      for (const member of members) {
        const memberDetails = await this.getMemberDetails(member);
        if (memberDetails != null) membersDetails.push(memberDetails);
      }
      Cache.set(key, membersDetails);
      return membersDetails;
    } catch (e: any) {
      console.error({ message: e.message });
      return [];
    }
  };

  getMemberDetails = async (member: Member): Promise<Member> => {
    return await this.httpClient.get<Member>(member.url, this.setToken());
  };

  private readonly filterRepos = (repos: Repository[]): Repository[] => {
    return repos.filter(repo => !repo.archived && !repo.fork && repo.license != null);
  };

  private readonly filterOrgs = (orgs: Organization[]): Organization[] => {
    return orgs.filter(org => org.type === 'Organization');
  };

  private readonly setToken = (): string => {
    return this.token != null ? `token ${this.token}` : '';
  };
}
