import 'dotenv/config';
import express from 'express';
import { parse } from 'node-html-parser';
import { get, has, set } from './cache';
import { Member, MemberProvider, Organization, Project, Repository } from './interfaces';

const app = express();

const _topic = 'soujunior-lab';

const baseUrl = 'https://api.github.com';

const token = process.env.GITHUB_TOKEN;

const api = async (url: string) => {
    url = setUrl(url);
    try {
        return (await fetch(url, {
            headers: {
                Authorization: token ? `token ${token}` : '',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
        })).json();
    } catch (e) {
        console.error(e);
    }
}

const getRepositoresByTopic = async (topic = _topic): Promise<Repository[]> => {
    try {
        const key = `repositories-${topic}`;
        if (has(key)) return get(key);
        const data = await api(`search/repositories?q=topic:${topic}&type=repositories&per_page=100`);
        const repositories: Repository[] = data.items.filter((repository: Repository) => repository.fork === false && repository.archived === false);
        set(key, repositories);
        return repositories;
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getOrganization = async (name: string): Promise<Organization> => {
    return await api(`orgs/${name}`) as Organization;
};

const getOrganizations = async (names: string[]): Promise<Organization[]> => {
    try {    
        const organizations: Organization[] = await Promise.all(setUnique(names).map(async (name: string) => await getOrganization(name)));
        return organizations.filter((organization: Organization) => organization.type === 'Organization');
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getLanguages = async (repository: Repository): Promise<string> => {
    const languages = await api(`${repository.languages_url}`);
    return Object.keys(languages).join(', ');
};

const getAllLanguages = async (repositories: Repository[]): Promise<string[]> => {
    try {
        const languages: string[] = await Promise.all(repositories.map(async (repository: Repository) => await getLanguages(repository)));
        const allLanguages: string[] = languages.map((language: string) => language.split(', ')).flat();
        return setUnique(allLanguages.filter((language: string) => language !== ''));
    } catch (e) {
        console.error(e);
        return [];
    }
};

const getMembers = async (organization: Organization): Promise<Member[]> => {
    try {
        if (organization.members_url == null) return [];
        const url = organization.members_url.replace('{/member}', '');
        const members: MemberProvider[] = await api(`${url}`);
        if (members == null) return [];
        const membersWithDetails: MemberProvider[] = await Promise.all(members.map(async (member: MemberProvider) => await api(`${member.url}`)));
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
        const html = await fetch(member.html_url).then((response) => response.text());
        if (html == null) return '';
        const link = parse(html).querySelector('a[href*="linkedin"]');
        const linkedin = link?.getAttribute('href') ?? '';
        set(member.html_url, linkedin);
        return linkedin;
    } catch (e) {
        console.error(e);
        return '';
    }
};

const setUrl = (url: string): string => {
    return url.startsWith('https://') ? url : `${baseUrl}/${url}`;
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
        console.debug('Getting data from GitHub API...');
        const repositories: Repository[] = await getRepositoresByTopic();
        const organizations: Organization[] = await getOrganizations(setUnique(repositories.map((repository: Repository) => repository.owner.login)));
        const projects = await Promise.all(organizations.map(async (organization: Organization) => {
            const members: Member[] = await getMembers(organization);
            const languages: string[] = await getAllLanguages(repositories.filter((repository: Repository) => repository.owner.login === organization.login));
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
