import {BaseApi} from '@elux-admin-antd/stage/utils/base';
import request from '@elux-admin-antd/stage/utils/request';
import {IAlterItems, ICreateItem, IDeleteItems, IGetItem, IGetList, IUpdateItem} from './entity';

export class API implements BaseApi {
  public getList(params: IGetList['Request']): Promise<IGetList['Response']> {
    return request.get<IGetList['Response']>('/api/member', {params}).then((res) => {
      return res.data;
    });
  }

  public getItem(params: IGetItem['Request']): Promise<IGetItem['Response']> {
    if (!params.id) {
      return Promise.resolve({} as any);
    }
    return request.get<IGetItem['Response']>(`/api/member/${params.id}`).then((res) => {
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

export default new API();
