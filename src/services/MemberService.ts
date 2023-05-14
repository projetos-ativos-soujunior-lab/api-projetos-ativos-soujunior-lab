import { Cache } from '../infra/Cache';
import { GitHub } from '../infra/api/GitHub';
import { type Member } from '../infra/providers/Member';
import { HTMLParser } from '../infra/utils/HTMLParser';

export class MemberService {
  getMember = async (url: string): Promise<Member | undefined> => {
    try {
      const key = `${url}`;
      if (Cache.has(key)) return Cache.get(key);
      const member = await GitHub.api(`${url}`);
      Cache.set(key, member);
      return member;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  getLinkedin = async (member: Member): Promise<string> => {
    try {
      const key = `${member.id}-linkedin`;
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
