export default interface HttpServer {
  on: (method: string, path: string, callback: any) => void;
  listen: (port: number) => void;
}
