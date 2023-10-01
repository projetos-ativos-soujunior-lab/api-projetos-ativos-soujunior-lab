import Member from './Member';
import Technology from './Technology';

export default class Project {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly url: string,
    readonly technologies: string[],
    readonly members: Member[]
  ) {}

  static create = async (org: any, languages: string[], topics: string[], _members: any[]): Promise<Project> => {
    const members: Member[] = [];
    const name = org.name ?? org.login;
    const description = org.description ?? '';
    const url = org.html_url;
    const technologies = Technology.create(languages, topics);
    for (const member of _members) {
      members.push(await Member.create(member.name, member.html_url, member.twitter_username, member.blog));
    }
    return new Project(name, description, url, technologies, members);
  };

  static filter = (projects: Project[]): Project[] => {
    const exclusionList = ['SouJunior'];
    return projects.filter(
      project => project.name !== undefined && !exclusionList.includes(project.name) && project.members.length > 0
    );
  };
}
