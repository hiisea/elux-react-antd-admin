import request, {IRequest} from '@elux-admin-antd/stage/utils/request';
import {BaseApi, BaseListItem, BaseListSearch, BaseListSummary, BaseModuleState, BaseRouteParams} from '@elux-admin-antd/stage/utils/resource';
import {enumOptions} from '@elux-admin-antd/stage/utils/tools';

export enum CurView {
  'list' = 'list',
  'detail' = 'detail',
}

export enum Gender {
  '男' = 'male',
  '女' = 'female',
  '未知' = 'unknow',
}

export const DGender = enumOptions(Gender);

export enum Status {
  '启用' = 'enable',
  '禁用' = 'disable',
}
export const DStatus = enumOptions(Status);

export enum Role {
  '普通用户' = 'consumer',
  '管理员' = 'admin',
  '责任编辑' = 'editor',
}

export const DRole = enumOptions(Role);

export interface ListSearch extends BaseListSearch {
  name?: string;
  nickname?: string;
  email?: string;
  role?: Role;
  status?: Status;
}
export interface ListItem extends BaseListItem {
  nickname: string;
  gender: Gender;
  role: Role;
  status: Status;
  articles: number;
  email: string;
  loginTime: number;
  createdTime: number;
}
export interface ListSummary extends BaseListSummary {}
export interface ItemDetail extends ListItem {}

export type ListSearchFormData = Omit<ListSearch, keyof BaseListSearch>;

export type RouteParams = BaseRouteParams<CurView, ListSearch>;
export type ModuleState = BaseModuleState<CurView, ListSearch, ListItem, ListSummary, ItemDetail>;

export const defaultListSearch: ListSearch = {pageCurrent: 1};

export type IGetList = IRequest<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;
export type IGetItem = IRequest<{id: string}, ItemDetail>;
export type IDeleteItem = IRequest<{id: string}, {id: string}>;
export type IUpdateItem = IRequest<ItemDetail, {id: string}>;
export type ICreateItem = IRequest<ItemDetail, {id: string}>;

export class API implements BaseApi {
  public getList(params: IGetList['Request']): Promise<IGetList['Response']> {
    return request.get<{list: ListItem[]; listSummary: ListSummary}>('/api/member', {params}).then((res) => {
      return res.data;
    });
  }

  public getItem(params: IGetItem['Request']): Promise<IGetItem['Response']> {
    if (params.id === '0') {
      return Promise.resolve({} as any);
    }
    return request.get<ItemDetail>(`/api/member/${params.id}`).then((res) => {
      return res.data;
    });
  }

  public deleteItem(params: IDeleteItem['Request']): Promise<IDeleteItem['Response']> {
    return request.delete<{id: string}>(`/api/member/${params.id}`).then((res) => {
      return res.data;
    });
  }

  public updateItem(params: IUpdateItem['Request']): Promise<IUpdateItem['Response']> {
    return request.put<{id: string}>(`/api/member/${params.id}`, params).then((res) => {
      return res.data;
    });
  }

  public createItem(params: ICreateItem['Request']): Promise<ICreateItem['Response']> {
    return request.post<{id: string}>(`/api/member`, params).then((res) => {
      return res.data;
    });
  }
  public alterItems(ids: string[], data: Partial<ItemDetail>): Promise<void> {
    return request.put<void>('/api/member', {ids, data}).then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
