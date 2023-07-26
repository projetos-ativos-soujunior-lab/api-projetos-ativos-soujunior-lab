import type Member from '../dto/Member';
import type Organization from '../dto/Organization';
import type Repository from '../dto/Repository';

export default interface GitHub {
  getReposByTopic: (topic: string) => Promise<Repository[]>;
  getRepoLanguages: (repo: Repository) => Promise<string[]>;
  getRepoTopics: (repo: Repository) => Promise<string[]>;
  getOrgByName: (name: string) => Promise<Organization>;
  getOrgsByName: (names: string[]) => Promise<Organization[]>;
  getOrgRepos: (org: Organization) => Promise<Repository[]>;
  getOrgLanguages: (org: Organization) => Promise<string[]>;
  getOrgTopics: (org: Organization) => Promise<string[]>;
  getMembersByOrg: (org: Organization) => Promise<Member[]>;
  getMemberDetails: (member: Member) => Promise<Member>;
}
