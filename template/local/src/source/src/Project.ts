/* eslint-disable import/no-extraneous-dependencies */
import stage from '@elux-admin-antd/stage';
import {AdminHomeUrl} from '@elux-admin-antd/stage/utils/const';
import {AppConfig, setConfig} from '@elux/react-web';
import {parse, stringify} from 'query-string';

//定义模块的获取方式，同步或者异步都可以， 注意key名必需和模块名保持一致
//配置成异步import(...)可以按需加载
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  //通常stage为根模块，使用同步加载，如果根模块要用别的名字，需要同时在以下setConfig中设置
  stage: () => stage,
  admin: () => import('@elux-admin-antd/admin'),
  dashboard: () => import('@elux-admin-antd/dashboard'),
  member: () => import('@elux-admin-antd/member'),
  article: () => import('@elux-admin-antd/article'),
};

//Elux全局设置，参见 https://eluxjs.com/api/react-web.setconfig.html
export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  //Elux并没定死怎么解析路由参数，你可以使用常用的'query-string'或者'json'
  //只需要将parse(解析)和stringify(序列化)方法设置给Elux
  QueryString: {parse, stringify},
  //elux内部使用的虚拟路由是独立自主的，但可以映射到原生路由
  NativePathnameMapping: {
    in(nativePathname) {
      if (nativePathname === '/') {
        nativePathname = AdminHomeUrl;
      }
      return nativePathname;
    },
    out(internalPathname) {
      return internalPathname;
    },
  },
});

export type IModuleGetter = typeof ModuleGetter;
