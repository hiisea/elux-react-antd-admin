/**
 * 该文件可以看作应用的先导文件，主要用来导出一些全局常用的方法、变量、和类型
 * 注意为了避免循环依赖，请保持该文件的独立性，不要引用任何其它项目文件
 */
/// <reference path="./env.d.ts" />
import {API, Facade, getApi} from '@elux/react-web';
import {IModuleGetter} from './Project';

type APP = API<Facade<IModuleGetter>>;

export type APPState = APP['State'];
export type PatchActions = APP['Actions']; // 使用demote命令兼容IE时使用

//几个全局常用的方法，参见 https://eluxjs.com/api/react-web.getapi.html
export const {Modules, LoadComponent, GetActions, GetClientRouter, useStore, useRouter} = getApi<APP>();

//脚手架编译时，会把elux.config.js中的`clientGlobalVar`值放入process.env.PROJ_ENV中，在此可以获取
//相当于在编译时就固化某些全局变量，你可以用来传递不同环境要用到的不同变量，比如url请求的前缀
export const {StaticPrefix, ApiPrefix} = process.env.PROJ_ENV as {
  StaticPrefix: string;
  ApiPrefix: string;
};
