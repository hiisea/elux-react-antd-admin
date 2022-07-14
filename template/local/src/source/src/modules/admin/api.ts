import {FavoritesUrlStorageKey} from '@elux-admin-antd/stage/utils/const';
import request from '@elux-admin-antd/stage/utils/request';
import {arrayToMap} from '@elux-admin-antd/stage/utils/tools';
import {IGetMenu, IGetNotices, MenuData, MenuItem, Tab, TabData} from './entity';

function memoMenuData(items: MenuItem[]): MenuData {
  const keyToParents: {[key: string]: string[]} = {};
  const matchToKey: {[match: string]: string} = {};
  const keyToLink: {[key: string]: string} = {};
  const checkData = (item: MenuItem, parentKey?: string) => {
    const {key, match, link} = item;
    if (keyToParents[key]) {
      throw `Menu ${key} 重复！`;
    }
    if (link) {
      keyToLink[key] = link;
    }
    const parents = [];
    if (parentKey) {
      parents.push(parentKey, ...keyToParents[parentKey]);
    }
    keyToParents[key] = parents;
    if (match) {
      const arr = typeof match === 'string' ? [match] : match;
      arr.forEach((rule) => {
        matchToKey[rule] = key;
      });
    }
    if (item.children) {
      item.children.forEach((subItem) => checkData(subItem, key));
    }
  };
  items.forEach((subItem) => checkData(subItem));
  return {items, keyToLink, keyToParents, matchToKey};
}

class API {
  public getNotices(): Promise<IGetNotices['Response']> {
    return request.get<IGetNotices['Response']>('/api/session/notices').then((res) => {
      return res.data;
    });
  }
  public getMenuData(): Promise<MenuData> {
    return request.get<IGetMenu['Response']>('/api/session/menu').then((res) => {
      return memoMenuData(res.data);
    });
  }
  public getTabData(): Promise<TabData> {
    const list: Tab[] = JSON.parse(localStorage.getItem(FavoritesUrlStorageKey) || '[]');
    const maps = arrayToMap(list);
    return Promise.resolve({list, maps});
  }
  public updateTabData(tabData: TabData): Promise<void> {
    localStorage.setItem(FavoritesUrlStorageKey, JSON.stringify(tabData.list));
    return Promise.resolve();
  }
}

export default new API();
