import request, {IRequest} from '@elux-admin-antd/stage/utils/request';
import {
  BaseApi,
  BaseListItem,
  BaseListSearch,
  BaseListSummary,
  BaseModuleState,
  BaseRouteParams,
  DefineResource,
} from '@elux-admin-antd/stage/utils/resource';
import {enumOptions} from '@elux-admin-antd/stage/utils/tools';

export enum CurView {
  'list' = 'list',
  'detail' = 'detail',
  'edit' = 'edit',
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
  createdTime: number;
}
export interface ListSummary extends BaseListSummary {}
export interface ItemDetail extends ListItem {}
export type UpdateItem = Omit<ItemDetail, 'id' | 'createdTime' | 'articles'>;

export type ListSearchFormData = Omit<ListSearch, keyof BaseListSearch>;

export interface MemberResource extends DefineResource {
  RouteParams: RouteParams;
  ModuleState: ModuleState;
  ListSearch: ListSearch;
  ListItem: ListItem;
  ListSummary: ListSummary;
  ItemDetail: ItemDetail;
  UpdateItem: UpdateItem;
  CreateItem: UpdateItem;
  CurView: CurView;
}

export type RouteParams = BaseRouteParams<MemberResource>;
export type ModuleState = BaseModuleState<MemberResource>;

export const defaultListSearch: ListSearch = {pageCurrent: 1};

export type IGetList = IRequest<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;
export type IGetItem = IRequest<{id: string}, ItemDetail>;
export type IAlterItems = IRequest<{id: string | string[]; data: Partial<ItemDetail>}, void>;
export type IDeleteItems = IRequest<{id: string | string[]}, void>;
export type IUpdateItem = IRequest<{id: string | string[]; data: UpdateItem}, void>;
export type ICreateItem = IRequest<ItemDetail, {id: string}>;

export class API implements BaseApi {
  public getList(params: IGetList['Request']): Promise<IGetList['Response']> {
    return request.get<{list: ListItem[]; listSummary: ListSummary}>('/api/member', {params}).then((res) => {
      return res.data;
    });
  }

  public getItem(params: IGetItem['Request']): Promise<IGetItem['Response']> {
    if (!params.id) {
      return Promise.resolve({} as any);
    }
    return request.get<ItemDetail>(`/api/member/${params.id}`).then((res) => {
      return res.data;
    });
  }

  public alterItems(params: IAlterItems['Request']): Promise<IAlterItems['Response']> {
    const {id, data} = params;
    const ids = typeof id === 'string' ? [id] : id;
    return request.put<void>(`/api/member/${ids.join(',')}`, data).then((res) => {
      return res.data;
    });
  }

  public updateItem(params: IUpdateItem['Request']): Promise<IUpdateItem['Response']> {
    const {id, data} = params;
    return request.put<void>(`/api/member/${id}`, data).then((res) => {
      return res.data;
    });
  }

  public deleteItems(params: IDeleteItems['Request']): Promise<IDeleteItems['Response']> {
    const {id} = params;
    const ids = typeof id === 'string' ? [id] : id;
    return request.delete<void>(`/api/member/${ids.join(',')}`).then((res) => {
      return res.data;
    });
  }

  public createItem(params: ICreateItem['Request']): Promise<ICreateItem['Response']> {
    return request.post<{id: string}>(`/api/member`, params).then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
