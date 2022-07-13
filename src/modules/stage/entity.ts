import {IRequest} from '@elux-admin-antd/stage/utils/base';

export interface CurUser {
  id: string;
  username: string;
  avatar: string;
  mobile: string;
  hasLogin: boolean;
}

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

export type IResetPassword = IRequest<ResetPasswordParams, void>;

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
