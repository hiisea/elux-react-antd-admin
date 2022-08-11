import {Action, BaseModel, Dispatch, RouteTarget, StoreState, effect, reducer} from '@elux/react-web';
import {pathToRegexp} from 'path-to-regexp';
import {useMemo, useState} from 'react';
import {useRouter} from '@/Global';
import {BaseApi, BaseListSearch, DefineResource} from './base';
import {DialogPageClassname} from './const';
import {excludeDefaultParams, mergeDefaultParams, message, useEvent} from './tools';

export abstract class BaseResource<TDefineResource extends DefineResource, TStoreState extends StoreState = StoreState> extends BaseModel<
  TDefineResource['ModuleState'],
  TStoreState
> {
  protected abstract api: BaseApi;
  protected abstract defaultListSearch: TDefineResource['ListSearch'];
  protected routeParams!: TDefineResource['RouteParams']; //保存从当前路由中提取的信息结果
  //因为要尽量避免使用public方法，所以构建this.privateActions来引用私有actions
  protected privateActions = this.getPrivateActions({putList: this.putList, putCurrentItem: this.putCurrentItem});

  protected parseListQuery(query: Record<string, string | undefined>): Record<string, any> {
    const data = {...query} as Record<string, any>;
    if (query.pageCurrent) {
      data.pageCurrent = parseInt(query.pageCurrent) || undefined;
    }
    return data;
  }

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): TDefineResource['RouteParams'] {
    const {pathname, searchQuery} = this.getRouter().location;
    const [, admin = '', subModule = '', curViewStr = '', curRenderStr = '', id = ''] =
      pathToRegexp('/:admin/:subModule/:curView/:curRender/:id?').exec(pathname) || [];
    const curView = curViewStr as TDefineResource['CurView'];
    const curRender = curRenderStr as TDefineResource['CurRender'];
    const prefixPathname = ['', admin, subModule].join('/');
    const routeParams: TDefineResource['RouteParams'] = {prefixPathname, curView};
    if (curView === 'list') {
      routeParams.curRender = curRender || 'maintain';
      const listQuery = this.parseListQuery(searchQuery);
      routeParams.listSearch = mergeDefaultParams(this.defaultListSearch, listQuery);
    } else if (curView === 'item') {
      routeParams.curRender = curRender || 'detail';
      routeParams.itemId = id;
    }
    return routeParams;
  }

  //每次路由发生变化，都会引起Model重新挂载到Store
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  //在此钩子执行完成之前，本模块的View将不会Render
  //在此钩子中可以await数据请求，等所有数据拉取回来后，一次性Render
  //在此钩子中也可以await子模块的mount，等所有子模块都挂载好了，一次性Render
  //也可以不做任何await，直接Render，此时需要设计Loading界面
  public onMount(env: 'init' | 'route' | 'update'): void {
    this.routeParams = this.getRouteParams();
    const {prefixPathname, curView, curRender, listSearch, itemId} = this.routeParams;
    this.dispatch(
      this.privateActions._initState({
        prefixPathname,
        curView,
        curRender,
        listSearch,
        itemId,
      } as TDefineResource['ModuleState'])
    );
    if (curView === 'list') {
      this.dispatch(this.actions.fetchList(listSearch));
    } else if (curView === 'item') {
      this.dispatch(this.actions.fetchItem(itemId || ''));
    }
  }

  @reducer
  public putList(
    listSearch: TDefineResource['ListSearch'],
    list: TDefineResource['ListItem'][],
    listSummary: TDefineResource['ListSummary']
  ): TDefineResource['ModuleState'] {
    return {...this.state, listSearch, list, listSummary};
  }

  @effect('this.listLoading')
  public async fetchList(listSearchData?: TDefineResource['ListSearch']): Promise<void> {
    const listSearch = listSearchData || this.state.listSearch || this.defaultListSearch;
    const {list, listSummary} = await this.api.getList!(listSearch);
    this.dispatch(this.privateActions.putList(listSearch, list, listSummary));
  }

  @reducer
  public putCurrentItem(itemId = '', itemDetail: TDefineResource['ItemDetail']): TDefineResource['ModuleState'] {
    return {...this.state, itemId, itemDetail};
  }

  @effect()
  public async fetchItem(itemId: string): Promise<void> {
    const item = await this.api.getItem!({id: itemId});
    this.dispatch(this.actions.putCurrentItem(itemId, item));
  }

  @effect()
  public async alterItems(id: string | string[], data: Partial<TDefineResource['UpdateItem']>): Promise<void> {
    await this.api.alterItems!({id, data});
    message.success('修改成功！');
    this.state.curView === 'list' && this.dispatch(this.actions.fetchList());
  }

  @effect()
  public async deleteItems(id: string | string[]): Promise<void> {
    await this.api.deleteItems!({id});
    message.success('删除成功！');
    this.state.curView === 'list' && this.dispatch(this.actions.fetchList());
  }

  @effect()
  public async updateItem(id: string, data: TDefineResource['UpdateItem']): Promise<void> {
    await this.api.updateItem!({id, data});
    await this.getRouter().back(1, 'window');
    message.success('编辑成功！');
    this.getRouter().back(0);
  }

  @effect()
  public async createItem(data: TDefineResource['CreateItem']): Promise<void> {
    await this.api.createItem!(data);
    await this.getRouter().back(1, 'window');
    message.success('创建成功！');
    this.getRouter().back(0);
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useSearch<TFormData>(listPathname: string, defaultListSearch: Partial<TFormData>) {
  const router = useRouter();
  const onSearch = useEvent((values: Partial<TFormData>) => {
    const searchQuery = excludeDefaultParams(defaultListSearch, {...values, pageCurrent: 1});
    router.push({pathname: listPathname, searchQuery, state: router.location.state}, 'page');
  });

  return {onSearch};
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useShowDetail(prefixPathname: string) {
  const router = useRouter();
  const onShowDetail = useEvent((id: string) => {
    router.push({url: `${prefixPathname}/item/detail/${id}`, classname: DialogPageClassname}, 'window');
  });
  const onShowEditor = useEvent((id: string, onSubmit: (id: string, data: Record<string, any>) => Promise<void>) => {
    router.push({url: `${prefixPathname}/item/edit/${id}`, classname: DialogPageClassname, state: {onSubmit}}, 'window');
  });

  return {onShowDetail, onShowEditor};
}

//eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useAlter<T>(
  dispatch: Dispatch,
  actions: {
    deleteItems?(id: string | string[]): Action;
    alterItems?(id: string | string[], data: Record<string, any>): Action;
    updateItem?(id: string, data: Record<string, any>): Action;
    createItem?(data: Record<string, any>): Action;
  },
  propsSelectedRows?: T[]
) {
  const [selectedRows, setSelectedRows] = useState(propsSelectedRows);

  useMemo(() => {
    setSelectedRows(propsSelectedRows);
  }, [propsSelectedRows]);

  const deleteItems = useEvent(async (id: string | string[]) => {
    await dispatch(actions.deleteItems!(id));
    setSelectedRows([]);
  });

  const alterItems = useEvent(async (id: string | string[], data: Record<string, any>) => {
    await dispatch(actions.alterItems!(id, data));
    setSelectedRows([]);
  });

  const updateItem = useEvent(async (id: string, data: Record<string, any>) => {
    if (id) {
      await dispatch(actions.updateItem!(id, data));
    } else {
      await dispatch(actions.createItem!(data));
    }

    setSelectedRows([]);
  });

  return {selectedRows, setSelectedRows, deleteItems, alterItems, updateItem};
}

export function useSingleWindow(): RouteTarget {
  const router = useRouter();
  return router.location.classname.startsWith('_') ? 'page' : 'window';
}

export function useTableSize(): 'middle' | 'large' {
  const router = useRouter();
  return router.location.classname.startsWith('_') ? 'middle' : 'large';
}

//eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useTableChange<T extends BaseListSearch>(listPathname: string, defaultListSearch: T, listSearch?: T) {
  const sorterStr = [listSearch?.sorterField, listSearch?.sorterOrder].join('');
  const router = useRouter();
  return useEvent((pagination: any, filter: any, _sorter: any) => {
    const sorter = _sorter as {field: string; order: 'ascend' | 'descend' | undefined};
    const {current, pageSize} = pagination as {current: number; pageSize: number};
    const sorterField = (sorter.order && sorter.field) || undefined;
    const sorterOrder = sorter.order || undefined;
    const currentSorter = [sorterField, sorterOrder].join('');
    const pageCurrent = currentSorter !== sorterStr ? 1 : current;

    const searchQuery = excludeDefaultParams(defaultListSearch, {...listSearch, pageCurrent, pageSize, sorterField, sorterOrder});

    router.push({pathname: listPathname, searchQuery, state: router.location.state}, 'page');
  });
}

//也可以使用回调到方法创建和编辑，但使用await 路由跳转更简单
// export function useUpdateItem(
//   id: string,
//   dispatch: Dispatch,
//   actions: {updateItem?(id: string, data: Record<string, any>): Action; createItem?(data: Record<string, any>): Action}
// ) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const onFinish = useEvent((values: Record<string, any>) => {
//     const {onSubmit} = (router.location.state || {}) as {onSubmit?: (id: string, data: Record<string, any>) => Promise<void>};
//     let result: Promise<void>;
//     setLoading(true);
//     if (onSubmit) {
//       result = onSubmit(id, values);
//     } else {
//       if (id) {
//         result = dispatch(actions.updateItem!(id, values)) as Promise<void>;
//       } else {
//         result = dispatch(actions.createItem!(values)) as Promise<void>;
//       }
//     }
//     result.finally(() => setLoading(false)).then(() => router.back(1, 'window'));
//   });

//   return {loading, onFinish};
// }
