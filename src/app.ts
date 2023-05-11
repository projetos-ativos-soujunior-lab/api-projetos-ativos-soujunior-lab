import 'dotenv/config';
import express from 'express';
import { get, has, set } from './cache';
import { Member } from './domain/models/Member';
import { Project } from './domain/models/Project';
import { GitHub } from './infra/api/GitHub';
import { MemberProvider } from './infra/providers/MemberProvider';
import { OrganizationProvider } from './infra/providers/OrganizationProvider';
import { RepositoryProvider } from './infra/providers/RepositoryProvider';
import { HtmlParser } from './infra/utils/HtmlParser';

const app = express();

const _topic = 'soujunior-lab';

const getRepositoresByTopic = async (topic = _topic): Promise<RepositoryProvider[]> => {
    try {
        const key = `repositories-${topic}`;
        if (has(key)) return get(key);
        const data = await GitHub.api(`search/repositories?q=topic:${topic}&type=repositories&per_page=100`);
        const repositories: RepositoryProvider[] = data.items.filter((repository: RepositoryProvider) => repository.fork === false && repository.archived === false);
        set(key, repositories);
        return repositories;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getOrganization = async (name: string): Promise<OrganizationProvider> => {
    return await GitHub.api(`orgs/${name}`) as OrganizationProvider;
};

const getOrganizations = async (names: string[]): Promise<OrganizationProvider[]> => {
    try {    
        const organizations: OrganizationProvider[] = await Promise.all(setUnique(names).map(async (name: string) => await getOrganization(name)));
        return organizations.filter((organization: OrganizationProvider) => organization.type === 'Organization');
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getLanguages = async (repository: RepositoryProvider): Promise<string> => {
    const languages = await GitHub.api(`${repository.languages_url}`);
    return Object.keys(languages).join(', ');
};

const getAllLanguages = async (repositories: RepositoryProvider[]): Promise<string[]> => {
    try {
        const languages: string[] = await Promise.all(repositories.map(async (repository: RepositoryProvider) => await getLanguages(repository)));
        const allLanguages: string[] = languages.map((language: string) => language.split(', ')).flat();
        return setUnique(allLanguages.filter((language: string) => language !== ''));
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getMembers = async (organization: OrganizationProvider): Promise<Member[]> => {
    try {
        if (organization.members_url == null) return [];
        const url = organization.members_url.replace('{/member}', '');
        const members: MemberProvider[] = await GitHub.api(`${url}`);
        if (members == null) return [];
        const membersWithDetails: MemberProvider[] = await Promise.all(members.map(async (member: MemberProvider) => await GitHub.api(`${member.url}`)));
        const memberList = membersWithDetails.map(async (member: MemberProvider) => {
            return {
                name: member.name ?? member.login,
                github: member.html_url,
                linkedin: await getLinkedin(member),
                twitter: member.twitter_username ?? '',
                site: getSite(member.blog),
            };
        });
        return await Promise.all(memberList);
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getLinkedin = async (member: MemberProvider): Promise<string> => {
    try {
        if (has(member.html_url)) return get(member.html_url);
        if (member.blog.includes('linkedin')) {
            set(member.html_url, member.blog);
            return member.blog;
        };
        const linkedin = await HtmlParser.getAtributte(member.html_url, 'a[href*="linkedin"]', 'href');
        set(member.html_url, linkedin);
        return linkedin;
    } catch (e) {
        console.error(e);
        return '';
    }
};

const getSite = (site: string): string => {
    return site.includes('linkedin') || site.includes('@') ? '' : site;
}

const setUnique = (array: string[]): string[] => {
    return [...new Set(array)];
};

const getData = async (): Promise<Project[]> => {
    try {
        const key = 'projects';
        if (has(key)) return get(key)
        console.debug('Getting data from GitHub GitHub.API...');
        const repositories: RepositoryProvider[] = await getRepositoresByTopic();
        const organizations: OrganizationProvider[] = await getOrganizations(setUnique(repositories.map((repository: RepositoryProvider) => repository.owner.login)));
        const projects = await Promise.all(organizations.map(async (organization: OrganizationProvider) => {
            const members: Member[] = await getMembers(organization);
            const languages: string[] = await getAllLanguages(repositories.filter((repository: RepositoryProvider) => repository.owner.login === organization.login));
            return {
                url: organization.html_url,
                name: organization.name ?? organization.login,
                description: organization.description ?? '',
                members,
                languages,
            };
        }));
        if (projects.length !== 0) set(key, projects);
        return projects;
    } catch (e) {
        console.error(e);
        return [];
    }
};

app.get('/', async (_req, res) => {
    res.json(await getData());
});

app.listen(5002, () => {
    console.log('Server is running on port 5002');
});
