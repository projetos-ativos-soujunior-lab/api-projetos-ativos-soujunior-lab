export class HttpClient {
    static get = async (url: string, token?: string): Promise<any> => {
        try {
            return (await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: token ? `token ${token}` : '',
                    'Content-Type': 'application/json',
                },
            })).json();
        } catch (e) {
            console.error(e);
        }
    };
}
