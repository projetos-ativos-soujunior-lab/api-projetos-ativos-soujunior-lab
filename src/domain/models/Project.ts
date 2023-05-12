import { type Member } from './Member';

export class Project {
  url: string;
  name: string;
  description: string;
  languages: string[];
  members: Member[];

  constructor(url: string, name: string, description: string, languages: string[], members: Member[]) {
    this.url = url;
    this.name = name;
    this.description = description;
    this.languages = languages;
    this.members = members;
  }
}
