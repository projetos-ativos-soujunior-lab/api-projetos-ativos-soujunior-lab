/* eslint-disable @typescript-eslint/no-explicit-any */
import NodeCache from 'node-cache';

export default class Cache {
  private static cache: NodeCache;
  private static readonly stdTTL = Number(process.env.CACHE_TTL);
  private static readonly checkperiod = 120;

  private static readonly configure = (stdTTL = this.stdTTL): NodeCache.Options => {
    return { stdTTL, checkperiod: this.checkperiod * 0.2, useClones: false };
  };

  static readonly has = (key: string): boolean => {
    return this.cache.has(key);
  };

  static readonly get = (key: string): any => {
    return this.cache.get(key);
  };

  static readonly set = (key: string, value: any, ttl = this.stdTTL): void => {
    this.cache.set(key, value, ttl);
  };

  static readonly clear = (): void => {
    this.cache.flushAll();
  };

  static readonly del = (key: string): void => {
    this.cache.del(key);
  };

  private static readonly init = (): NodeCache => {
    return new NodeCache(this.configure());
  };

  static {
    this.cache = this.init();
    console.debug(`Cache Time: ${this.stdTTL / 60} minutes`);
  }
}
