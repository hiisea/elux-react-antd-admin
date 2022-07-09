import request, {IRequest} from '@elux-admin-antd/stage/utils/request';
import {
  BaseApi,
  BaseCurRender,
  BaseCurView,
  BaseListItem,
  BaseListSearch,
  BaseListSummary,
  BaseModuleState,
  BaseRouteParams,
  DefineResource,
} from '@elux-admin-antd/stage/utils/resource';
import {enumOptions} from '@elux-admin-antd/stage/utils/tools';

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
  author: {id: string; name: string};
  editors: Array<{id: string; name: string}>;
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

export class API implements BaseApi {
  public getList(params: IGetList['Request']): Promise<IGetList['Response']> {
    params = {...params};
    params.author && (params.author = params.author.split(',', 1)[0]);
    params.editor && (params.editor = params.editor.split(',', 1)[0]);
    return request.get<{list: ListItem[]; listSummary: ListSummary}>('/api/article', {params}).then((res) => {
      return res.data;
    });
  }

  public getItem(params: IGetItem['Request']): Promise<IGetItem['Response']> {
    if (!params.id) {
      return Promise.resolve({} as any);
    }
    return request.get<ItemDetail>(`/api/article/${params.id}`).then((res) => {
      return res.data;
    });
  }

  public alterItems(params: IAlterItems['Request']): Promise<IAlterItems['Response']> {
    const {id, data} = params;
    const ids = typeof id === 'string' ? [id] : id;
    return request.put<void>(`/api/article/${ids.join(',')}`, data).then((res) => {
      return res.data;
    });
  }

  public updateItem(params: IUpdateItem['Request']): Promise<IUpdateItem['Response']> {
    const {id, data} = params;
    return request.put<void>(`/api/article/${id}`, data).then((res) => {
      return res.data;
    });
  }

  public deleteItems(params: IDeleteItems['Request']): Promise<IDeleteItems['Response']> {
    const {id} = params;
    const ids = typeof id === 'string' ? [id] : id;
    return request.delete<void>(`/api/article/${ids.join(',')}`).then((res) => {
      return res.data;
    });
  }

  public createItem(params: ICreateItem['Request']): Promise<ICreateItem['Response']> {
    return request.post<{id: string}>(`/api/article`, params).then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
