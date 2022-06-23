//定义本模块涉及的业务实体和数据API
import request, {IRequest} from '@/utils/request';
export interface ListSearch {
  keyword: string;
  pageCurrent: number;
}
export interface ListItem {
  id: string;
  title: string;
  summary: string;
}
export interface ListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const defaultListSearch: ListSearch = {
  pageCurrent: 1,
  keyword: '',
};

export interface ItemDetail extends ListItem {
  content: string;
}

export enum CurView {
  'list' = 'list',
  'detail' = 'detail',
  'edit' = 'edit',
}

export type IGetList = IRequest<ListSearch, {list: ListItem[]; listSummary: ListSummary}>;
export type IGetItem = IRequest<{id: string}, ItemDetail>;
export type IDeleteItem = IRequest<{id: string}, {id: string}>;
export type IUpdateItem = IRequest<ItemDetail, {id: string}>;
export type ICreateItem = IRequest<ItemDetail, {id: string}>;

export class API {
  public getList(params: IGetList['Request']): Promise<IGetList['Response']> {
    return request.get<{list: ListItem[]; listSummary: ListSummary}>('/api/article', {params}).then((res) => {
      return res.data;
    });
  }

  public getItem(params: IGetItem['Request']): Promise<IGetItem['Response']> {
    if (params.id === '0') {
      return Promise.resolve({id: '', title: '', summary: '', content: ''});
    }
    return request.get<ItemDetail>(`/api/article/${params.id}`).then((res) => {
      return res.data;
    });
  }

  public deleteItem(params: IDeleteItem['Request']): Promise<IDeleteItem['Response']> {
    return request.delete<{id: string}>(`/api/article/${params.id}`).then((res) => {
      return res.data;
    });
  }

  public updateItem(params: IUpdateItem['Request']): Promise<IUpdateItem['Response']> {
    return request.put<{id: string}>(`/api/article/${params.id}`, params).then((res) => {
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
