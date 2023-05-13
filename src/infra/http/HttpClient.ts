/* eslint-disable @typescript-eslint/no-explicit-any */
export class HttpClient {
  static get = async (url: string, token: string): Promise<any> => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
    }
  };
}
