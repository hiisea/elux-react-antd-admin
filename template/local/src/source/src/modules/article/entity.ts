import {
  BaseCurRender,
  BaseCurView,
  BaseListItem,
  BaseListSearch,
  BaseListSummary,
  BaseModuleState,
  BaseRouteParams,
  DefineResource,
  IRequest,
  enumOptions,
} from '@elux-admin-antd/stage/utils/base';

export enum Status {
  '待审核' = 'pending',
  '审核通过' = 'resolved',
  '审核拒绝' = 'rejected',
}
export const DStatus = enumOptions(Status);

export type CurView = BaseCurView;
export type CurRender = BaseCurRender;

export interface ListSearch extends BaseListSearch {
  title?: string;
  author?: string;
  editor?: string;
  status?: Status;
}
export interface ListItem extends BaseListItem {
  title: string;
  summary: string;
  content: string;
  author: string;
  editors: string[];
  status: Status;
  createdTime: number;
}
export interface ListSummary extends BaseListSummary {}
export interface ItemDetail extends ListItem {}
export type UpdateItem = Pick<ItemDetail, 'title' | 'summary' | 'content' | 'editors'>;

export type ListSearchFormData = Omit<ListSearch, keyof BaseListSearch>;

export interface ArticleResource extends DefineResource {
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

export type RouteParams = BaseRouteParams<ArticleResource>;
export type ModuleState = BaseModuleState<ArticleResource>;

export const defaultListSearch: ListSearch = {
  pageCurrent: 1,
  pageSize: 10,
  sorterOrder: undefined,
  sorterField: '',
  title: '',
  author: '',
  editor: '',
  status: undefined,
};

export type IGetList = IRequest<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;
export type IGetItem = IRequest<{id: string}, ItemDetail>;
export type IAlterItems = IRequest<{id: string | string[]; data: Partial<ItemDetail>}, void>;
export type IDeleteItems = IRequest<{id: string | string[]}, void>;
export type IUpdateItem = IRequest<{id: string | string[]; data: UpdateItem}, void>;
export type ICreateItem = IRequest<ItemDetail, {id: string}>;
