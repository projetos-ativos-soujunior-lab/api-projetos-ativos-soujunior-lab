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

  static builder = async (org: any, languages: string[], topics: string[], members: any[]): Promise<Project> => {
    const name = org.name ?? org.login;
    const description = org.description ?? '';
    const url = org.html_url;
    const technologies = Technology.builder(languages, topics);
    const memberList = await Member.builder(members);
    return new Project(name, description, url, technologies, memberList);
  };

  static filter = (projects: Project[]): Project[] => {
    const exclusionList = ['SouJunior'];
    return projects.filter(
      project => project.name !== undefined && !exclusionList.includes(project.name) && project.members.length > 0
    );
  };
}
