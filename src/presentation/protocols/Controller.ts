export default interface Controller<T = any> {
  handle: (request: T) => Promise<T>;
}
