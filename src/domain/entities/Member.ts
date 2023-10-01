import HTMLParser from '../../infra/HTMLParser';

export default class Member {
  private constructor(
    readonly name: string,
    readonly github: string,
    readonly linkedin: string,
    readonly twitter: string,
    readonly site: string
  ) {}

  static create = async (name: string, github: string, twitter: string, blog: string): Promise<Member> => {
    const linkedin = blog.includes('linkedin') ? blog : await Member.getLinkedin(github);
    const site = Member.getSite(blog);
    return new Member(name, github, linkedin, twitter, site);
  };

  static readonly getLinkedin = async (github: string): Promise<string> => {
    const selector = 'a[href*="linkedin"]';
    const atributte = 'href';
    const linkedin = await HTMLParser.parse(github, selector, atributte);
    return linkedin;
  };

  static readonly getSite = (site: string): string => {
    return site.includes('linkedin') || site.includes('@') ? '' : site;
  };
}
