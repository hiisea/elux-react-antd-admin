import {
  BaseCurRender,
  BaseCurView,
  BaseListItem,
  BaseListSearch,
  BaseListSummary,
  BaseLocationState,
  BaseModuleState,
  BaseRouteParams,
  DefineResource,
  IRequest,
  enumOptions,
} from '@elux-admin-antd/stage/utils/base';

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

export type CurView = BaseCurView;
export type CurRender = BaseCurRender;

export type LocationState = BaseLocationState<ListItem>;

export interface ListSearch extends BaseListSearch {
  name?: string;
  nickname?: string;
  email?: string;
  role?: Role;
  status?: Status;
}
export interface ListItem extends BaseListItem {
  name: string;
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
  CurRender: CurRender;
}

export type RouteParams = BaseRouteParams<MemberResource>;
export type ModuleState = BaseModuleState<MemberResource>;

export const defaultListSearch: ListSearch = {
  pageCurrent: 1,
  pageSize: 10,
  sorterOrder: undefined,
  sorterField: '',
  name: '',
  nickname: '',
  email: '',
  role: undefined,
  status: undefined,
};

export type IGetList = IRequest<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;
export type IGetItem = IRequest<{id: string}, ItemDetail>;
export type IAlterItems = IRequest<{id: string | string[]; data: Partial<ItemDetail>}, void>;
export type IDeleteItems = IRequest<{id: string | string[]}, void>;
export type IUpdateItem = IRequest<{id: string | string[]; data: UpdateItem}, void>;
export type ICreateItem = IRequest<ItemDetail, {id: string}>;
