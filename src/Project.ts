//该文件可以看作应用的配置文件
import {AppConfig, setConfig} from '@elux/react-web';
import {parse, stringify} from 'query-string';
import stage from '@/modules/stage';
import {HomeUrl} from '@/utils/const';

//定义模块的获取方式，同步或者异步都可以， 注意key名必需和模块名保持一致
//配置成异步import(...)可以按需加载
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const ModuleGetter = {
  //通常stage为根模块，使用同步加载，如果根模块要用别的名字，需要同时在以下setConfig中设置
  stage: () => stage,
  article: () => import('@/modules/article'),
  shop: () => import('@/modules/shop'),
  admin: () => import('@/modules/admin'),
  my: () => import('@/modules/my'),
};

//Elux全局设置，参见 https://eluxjs.com/api/react-web.setconfig.html
export const appConfig: AppConfig = setConfig({
  ModuleGetter,
  //Elux并没定死怎么解析路由参数，你可以使用常用的'query-string'或者'json'
  //只需要将parse(解析)和stringify(序列化)方法设置给Elux
  QueryString: {parse, stringify},
  HomeUrl,
  NativePathnameMapping: {
    in(nativePathname) {
      if (nativePathname === '/') {
        nativePathname = '/admin/article/list';
      }
      return nativePathname;
    },
    out(internalPathname) {
      return internalPathname;
    },
  },
});

export type IModuleGetter = typeof ModuleGetter;
