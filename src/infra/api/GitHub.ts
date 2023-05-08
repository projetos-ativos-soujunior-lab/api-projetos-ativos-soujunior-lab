export class GitHub {
    private static readonly baseUrl = 'https://api.github.com';
    private static readonly token = process.env.GITHUB_TOKEN;

    public static async api(url: string): Promise<any> {
        url = this.setUrl(url);
        try {
            return (await fetch(url, {
                headers: {
                    Authorization: this.token ? `token ${this.token}` : '',
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
            })).json();
        } catch (e) {
            console.error(e);
        }
    }

    private static setUrl(url: string): string {
        return url.startsWith('https://') ? url : `${this.baseUrl}/${url}`;
    }
}
