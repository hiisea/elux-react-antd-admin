import request, {IRequest} from '@/utils/request';

export enum SubModule {
  'article' = 'article',
  'my' = 'my',
}

export interface Notices {
  num: number;
}

export type IGetNotices = IRequest<{}, Notices>;

class API {
  public getNotices(): Promise<IGetNotices['Response']> {
    return request.get<Notices>('/api/session/notices').then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
