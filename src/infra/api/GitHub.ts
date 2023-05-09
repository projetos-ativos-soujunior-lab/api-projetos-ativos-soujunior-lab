import { HttpClient } from "../http/HttpClient";

export class GitHub {
    private static readonly baseUrl = 'https://api.github.com';
    private static readonly token = process.env.GITHUB_TOKEN;

    public static async api(url: string): Promise<any> {
        url = this.setUrl(url);
        return await HttpClient.get(url, this.token);
    }

    private static setUrl(url: string): string {
        return url.startsWith('https://') ? url : `${this.baseUrl}/${url}`;
    }
}
