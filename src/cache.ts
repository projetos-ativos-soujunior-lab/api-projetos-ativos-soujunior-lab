import NodeCache from 'node-cache';

const cache = new NodeCache({
    stdTTL: 1800, // 30 minutes 
    checkperiod: 120 * 0.2, // 24 seconds
    useClones: false,
});

const has = (key: string): boolean => {
    return cache.has(key);
}

const get = (key: string): any => {
    return cache.get(key);
}

const set = (key: string, value: any): void => {
    cache.set(key, value);
}

export {
    get, has, set
};
