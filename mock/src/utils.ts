export function extractQuery<T extends {[key: string]: string}>(def: T, query: any): T {
  return Object.keys(def).reduce((data, key) => {
    data[key] = query[key] || def[key];
    return data;
  }, {}) as any;
}
