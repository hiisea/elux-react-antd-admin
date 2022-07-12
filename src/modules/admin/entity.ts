import {IRequest} from '@elux-admin-antd/stage/utils/base';

export enum SubModule {
  'dashboard' = 'dashboard',
  'member' = 'member',
  'article' = 'article',
}

export interface Notices {
  num: number;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
}

export interface TabData {
  list: Tab[];
  maps: {[id: string]: Tab};
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  match?: string | string[];
  link?: string;
  children?: MenuItem[];
  disable?: boolean;
}

export interface MenuData {
  items: MenuItem[];
  keyToParents: {[key: string]: string[]};
  keyToLink: {[key: string]: string};
  matchToKey: {[match: string]: string};
}
export type IGetNotices = IRequest<{}, Notices>;

export type IGetMenu = IRequest<{}, MenuItem[]>;
