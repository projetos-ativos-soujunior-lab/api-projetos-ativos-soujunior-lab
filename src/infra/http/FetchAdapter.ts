import type HttpClient from './HttpClient';

export default class FetchAdapter implements HttpClient {
  get = async <T>(url: string, token?: string): Promise<T> => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token ?? '',
        },
      });
      return await response.json();
    } catch (e) {
      console.error(e);
      return null as T;
    }
  };
}
