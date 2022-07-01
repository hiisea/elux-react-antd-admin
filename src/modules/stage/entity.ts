//定义本模块涉及的业务实体和数据API
import {isServer} from '@elux/react-web';
import request, {IRequest} from './utils/request';

export interface CurUser {
  id: string;
  username: string;
  avatar: string;
  mobile: string;
  hasLogin: boolean;
}

export const guest: CurUser = {
  id: '',
  username: '游客',
  hasLogin: false,
  avatar: '',
  mobile: '',
};

export interface LoginParams {
  username: string;
  password: string;
  keep: boolean;
}

export interface RegisterParams {
  username: string;
  password: string;
}

export interface SendCaptchaParams {
  phone: string;
}

export interface ResetPasswordParams {
  phone: string;
  password: string;
  captcha: string;
}

export type IGetCurUser = IRequest<{}, CurUser>;

export type ILogin = IRequest<LoginParams, CurUser>;

export type ILogout = IRequest<{}, CurUser>;

export type IRegistry = IRequest<RegisterParams, CurUser>;

export type ISendCaptcha = IRequest<SendCaptchaParams, void>;

export type IResetPassword = IRequest<ResetPasswordParams, CurUser>;

export enum SubModule {
  'shop' = 'shop',
  'admin' = 'admin',
}

export enum CurView {
  'login' = 'login',
  'registry' = 'registry',
  'agreement' = 'agreement',
  'forgetPassword' = 'forgetPassword',
}

class API {
  public getCurUser(): Promise<IGetCurUser['Response']> {
    if (isServer()) {
      return Promise.resolve(guest);
    }
    return request
      .get<CurUser>('/api/session')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return guest;
      });
  }
  public login(params: ILogin['Request']): Promise<ILogin['Response']> {
    return request.put<CurUser>('/api/session', params).then((res) => {
      return res.data;
    });
  }

  public logout(): Promise<ILogout['Response']> {
    return request.delete<CurUser>('/api/session').then((res) => {
      return res.data;
    });
  }

  public registry(params: IRegistry['Request']): Promise<IRegistry['Response']> {
    return request.post<CurUser>('/api/session', params).then((res) => {
      return res.data;
    });
  }

  public resetPassword(params: IResetPassword['Request']): Promise<IResetPassword['Response']> {
    return request.put<CurUser>('/api/session/resetPassword', params).then((res) => {
      return res.data;
    });
  }

  public sendCaptcha(params: ISendCaptcha['Request']): Promise<ISendCaptcha['Response']> {
    return request.post<void>('/api/session/sendCaptcha', params).then((res) => {
      return res.data;
    });
  }
}

export const api = new API();
