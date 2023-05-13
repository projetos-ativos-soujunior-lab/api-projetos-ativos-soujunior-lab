import { type MemberDto } from './MemberDto';

export interface ProjectDto {
  name: string;
  url: string;
  description: string;
  languages: string[];
  members: MemberDto[];
}
