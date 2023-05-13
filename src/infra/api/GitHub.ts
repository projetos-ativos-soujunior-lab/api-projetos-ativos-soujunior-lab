/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '../http/HttpClient';

export class GitHub {
  private static readonly baseUrl = 'https://api.github.com';
  private static readonly token = process.env.GITHUB_TOKEN as string;

  public static api = async (url: string): Promise<any> => {
    url = this.setUrl(url);
    console.debug('Getting data from GitHub API...');
    return await HttpClient.get(url, this.setToken(this.token));
  };

  private static readonly setUrl = (url: string): string => {
    return url.startsWith('https://') ? url : `${this.baseUrl}/${url}`;
  };

  private static readonly setToken = (token: string): string => {
    return token != null ? `token ${token}` : '';
  };
}
