export default interface HttpClient {
  get: <T>(url: string, token?: string) => Promise<T>;
}
