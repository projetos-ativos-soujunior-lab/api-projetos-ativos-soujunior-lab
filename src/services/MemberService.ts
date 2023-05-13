import { Cache } from '../infra/Cache';
import { GitHub } from '../infra/api/GitHub';
import { type Member } from '../infra/providers/Member';
import { type Organization } from '../infra/providers/Organization';
import { HTMLParser } from '../infra/utils/HTMLParser';

export class MemberService {
  getMember = async (url: string): Promise<Member | undefined> => {
    try {
      const key = `member-${url}`;
      if (Cache.has(key)) return Cache.get(key);
      const member = await GitHub.api(`${url}`);
      Cache.set(key, member);
      return member;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  getMembers = async (organization: Organization): Promise<Member[]> => {
    try {
      const key = `members-${organization.login}`;
      if (Cache.has(key)) return Cache.get(key);
      if (organization.members_url == null) return [];
      const members_url: string = organization.members_url.replace('{/member}', '');
      const members: Member[] = await GitHub.api(`${members_url}`);
      if (members == null) return [];
      const membersWithDetails: Member[] = [];
      for (const member of members) {
        const memberWithDetails: Member | undefined = await this.getMember(member.url);
        if (memberWithDetails != null) membersWithDetails.push(memberWithDetails);
      }
      Cache.set(key, membersWithDetails);
      return membersWithDetails;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getLinkedin = async (member: Member): Promise<string> => {
    try {
      const key = `linkedin-${member.login}`;
      if (Cache.has(key)) return Cache.get(key);
      if (member.blog.includes('linkedin')) {
        Cache.set(key, member.blog);
        return member.blog;
      }
      const selector = 'a[href*="linkedin"]';
      const atributte = 'href';
      const linkedin = await HTMLParser.parse(member.html_url, selector, atributte);
      Cache.set(key, linkedin);
      return linkedin;
    } catch (e) {
      console.error(e);
      return '';
    }
  };

  getSite = (site: string): string => {
    return site.includes('linkedin') || site.includes('@') ? '' : site;
  };
}
