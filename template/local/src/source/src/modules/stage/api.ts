import request from '@elux-admin-antd/stage/utils/request';
import {CurUser, IGetCurUser, ILogin, ILogout, IRegistry, IResetPassword, ISendCaptcha} from './entity';

export const guest: CurUser = {
  id: '',
  username: '游客',
  hasLogin: false,
  avatar: '',
  mobile: '',
};

class API {
  public getCurUser(): Promise<IGetCurUser['Response']> {
    return request
      .get<IGetCurUser['Response']>('/api/session')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return guest;
      });
  }
  public login(params: ILogin['Request']): Promise<ILogin['Response']> {
    return request.put<CurUser>('/api/session', params).then((res) => {
      localStorage.setItem('token', res.data.id + res.data.username);
      return res.data;
    });
  }

  public logout(): Promise<ILogout['Response']> {
    return request.delete<CurUser>('/api/session').then((res) => {
      localStorage.removeItem('token');
      return res.data;
    });
  }

  public registry(params: IRegistry['Request']): Promise<IRegistry['Response']> {
    return request.post<CurUser>('/api/session', params).then((res) => {
      localStorage.setItem('token', res.data.id + res.data.username);
      return res.data;
    });
  }

  public resetPassword(params: IResetPassword['Request']): Promise<IResetPassword['Response']> {
    return request.put<void>('/api/session/resetPassword', params).then((res) => {
      return res.data;
    });
  }

  public sendCaptcha(params: ISendCaptcha['Request']): Promise<ISendCaptcha['Response']> {
    return request.post<void>('/api/session/sendCaptcha', params).then((res) => {
      return res.data;
    });
  }
}

export default new API();
