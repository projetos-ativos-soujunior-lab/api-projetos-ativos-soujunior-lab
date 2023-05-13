import { type Member } from '../../infra/providers/Member';
import { MemberService } from '../../services/MemberService';

export interface MemberDto {
  name: string;
  github: string;
  linkedin: string;
  twitter: string;
  site: string;
}

export class MemberMapper {
  static toDto = async (member: Member): Promise<MemberDto> => {
    const memberService = new MemberService();
    return {
      name: member.name ?? member.login,
      github: member.html_url,
      linkedin: await memberService.getLinkedin(member),
      twitter: member.twitter_username ?? '',
      site: memberService.getSite(member.blog),
    };
  };

  static toDtos = async (members: Member[]): Promise<MemberDto[]> => {
    const memberDtos: MemberDto[] = [];
    for (const member of members) {
      memberDtos.push(await MemberMapper.toDto(member));
    }
    return memberDtos;
  };
}
