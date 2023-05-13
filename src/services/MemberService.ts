import { GitHub } from '../infra/api/GitHub';
import { type Member } from '../infra/providers/Member';
import { type Organization } from '../infra/providers/Organization';
import { HTMLParser } from '../infra/utils/HTMLParser';

export class MemberService {
  getMember = async (memberUrl: string): Promise<Member | undefined> => {
    try {
      return await GitHub.api(`${memberUrl}`);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  getMembers = async (organization: Organization): Promise<Member[]> => {
    try {
      if (organization.members_url == null) return [];
      const members_url: string = organization.members_url.replace('{/member}', '');
      const members: Member[] = await GitHub.api(`${members_url}`);
      if (members == null) return [];
      const membersWithDetails: Member[] = [];
      for (const member of members) {
        const memberWithDetails: Member | undefined = await this.getMember(member.url);
        if (memberWithDetails != null) membersWithDetails.push(memberWithDetails);
      }
      return membersWithDetails;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  getLinkedin = async (member: Member): Promise<string> => {
    if (member.blog.includes('linkedin')) {
      return member.blog;
    }
    try {
      const linkedin = await HTMLParser.parse(member.html_url, 'a[href*="linkedin"]', 'href');
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
