import type HttpResponse from './HttpResponse';

export default interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>;
}
