import HTMLParser from '../../infra/HTMLParser';

export default class Member {
  constructor(
    readonly name: string,
    readonly github: string,
    readonly linkedin: string,
    readonly twitter: string,
    readonly site: string
  ) {}

  static create = async (member: any): Promise<Member> => {
    const linkedin = await Member.getLinkedin(member);
    const twitter = member.twitter_username ?? '';
    const site = this.getSite(member.blog);
    return new Member(member.name, member.html_url, linkedin, twitter, site);
  };

  static readonly getLinkedin = async (member: any): Promise<string> => {
    if (member.blog.includes('linkedin') === true) return member.blog;
    const selector = 'a[href*="linkedin"]';
    const atributte = 'href';
    const linkedin = await HTMLParser.parse(member.html_url, selector, atributte);
    return linkedin;
  };

  static readonly getSite = (site: string): string => {
    return site.includes('linkedin') || site.includes('@') ? '' : site;
  };
}
