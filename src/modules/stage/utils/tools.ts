import {Rule} from 'antd/lib/form';
import {FormItemProps} from 'antd/lib/form/FormItem';
import {useCallback, useEffect, useRef, useState} from 'react';

export function useEvent<F extends Function>(callback: F): F {
  const callbackRef = useRef<any>(null);

  useEffect(() => {
    callbackRef.current = callback;
  });

  const event = useCallback((...args) => {
    if (callbackRef.current) {
      callbackRef.current.apply(null, args);
    }
  }, []);

  return event as any;
}

export function useInit(): boolean {
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    setInitializing(false);
  }, []);
  return initializing;
}

export {message} from 'antd';

export interface FormDecorator<T = string> {
  label?: string;
  dependencies?: T[];
  rules?: Rule[];
  valuePropName?: string;
}

export interface SearchFormDecorator<T = string> {
  name: T;
  formItem: FormItemProps['children'];
  label: string;
  rules?: Rule[];
  col?: number;
  cite?: number;
}

export type SearchFromItems<TFormData> = Array<SearchFormDecorator<keyof TFormData>>;

export function getFormDecorators<TFormData>(items: {[key in keyof TFormData]: FormDecorator<keyof TFormData>}): {
  [key in keyof TFormData]: FormDecorator<keyof TFormData> & {name: string};
} {
  Object.entries(items).forEach(([key, item]: [string, any]) => {
    item.name = key;
  });
  return items as any;
}

export function arrayToMap<T>(arr: T[], key = 'id'): {[key: string]: T} {
  return arr.reduce((pre, cur) => {
    pre[cur[key]] = cur;
    return pre;
  }, {});
}

export function loadingPlaceholder(val: string | undefined): string {
  return val || '...';
}

export function splitIdName(str: string): {id: string; name: string} {
  if (str.includes(',')) {
    const [id] = str.split(',', 1);
    return {id, name: str.replace(id + ',', '')};
  } else {
    return {id: str, name: str};
  }
}

// export function urlPushQuery(url: string, query: {[key: string]: any} = {}): string {
//   const queryStr = stringify(query);
//   return queryStr ? `${url}${url.indexOf('?') > -1 ? '&' : '?'}${queryStr}` : url;
// }

function isMapObject(obj: any): Boolean {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export function mergeDefaultParams<T extends {[key: string]: any}>(defaultParams: T, targetParams: {[key: string]: any}): T {
  return Object.keys(defaultParams).reduce((result, key) => {
    const defVal = defaultParams[key];
    const tgtVal = targetParams[key];
    if (tgtVal == undefined) {
      result[key] = defVal;
    } else if (isMapObject(defVal) && isMapObject(tgtVal)) {
      result[key] = mergeDefaultParams(defVal, tgtVal);
    } else {
      result[key] = tgtVal;
    }
    return result;
  }, {}) as any;
}

export function excludeDefaultParams(defaultParams: {[key: string]: any}, targetParams: {[key: string]: any}): {[key: string]: any} | undefined {
  const result: any = {};
  let hasSub = false;
  Object.keys(targetParams).forEach((key) => {
    let tgtVal = targetParams[key];
    const defVal = defaultParams[key];
    if (tgtVal !== defVal) {
      if (isMapObject(defVal) && isMapObject(tgtVal)) {
        tgtVal = excludeDefaultParams(defVal, tgtVal);
      }
      if (tgtVal !== undefined) {
        hasSub = true;
        result[key] = tgtVal;
      }
    }
  });
  return hasSub ? result : undefined;
}

// fork from 'fast-deep-equal'
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    let length: number, i: number;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    const keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0; ) {
      const key = keys[i];

      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  return a !== a && b !== b;
}
