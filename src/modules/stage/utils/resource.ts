import {BaseModel, Dispatch, LoadingState, PickModelActions, StoreState, effect, reducer} from '@elux/react-web';
import {pathToRegexp} from 'path-to-regexp';
import {useCallback} from 'react';
import {GetClientRouter} from '@/Global';
import {excludeDefaultParams, mergeDefaultParams} from './tools';

export type BaseCurView = 'list' | 'detail';

export interface BaseListSearch {
  pageCurrent?: number;
  pageSize?: number;
  sorterOrder?: 'ascend' | 'descend';
  sorterField?: string;
}

export interface BaseListItem {
  id: string;
  name: string;
}

export interface BaseListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  categorys?: {id: string; name: string; ids: string[]}[];
}

export interface BaseItemDetail extends BaseListItem {}

export interface BaseModuleState<
  CurView extends BaseCurView = BaseCurView,
  ListSearch extends BaseListSearch = BaseListSearch,
  ListItem extends BaseListItem = BaseListItem,
  ListSummary extends BaseListSummary = BaseListSummary,
  ItemDetail extends BaseItemDetail = BaseItemDetail
> {
  prefixPathname: string;
  listSearch: ListSearch;
  curView?: CurView;
  list?: ListItem[];
  listSummary?: ListSummary;
  listLoading?: LoadingState;
  itemId?: string;
  itemDetail?: ItemDetail;
}

export interface BaseRouteParams<CurView extends BaseCurView = BaseCurView, ListSearch extends BaseListSearch = BaseListSearch> {
  prefixPathname: string;
  curView?: CurView;
  listSearch: ListSearch;
  itemId?: string;
}

export interface BaseApi {
  getList?(listSearch: BaseListSearch): Promise<{list: BaseListItem[]; listSummary: BaseListSummary}>;
  getItem?(params: {id: string}): Promise<BaseItemDetail>;
  alterItems?(ids: string[], data: Record<string, any>): Promise<void>;
}

export abstract class BaseResource<
  TRouteParams extends BaseRouteParams,
  TModuleState extends BaseModuleState,
  TStoreState extends StoreState = StoreState
> extends BaseModel<TModuleState, TStoreState> {
  protected abstract api: BaseApi;
  protected abstract CurView: {[key: string]: TModuleState['curView']};
  protected abstract defaultListSearch: TModuleState['listSearch'];
  protected routeParams!: TRouteParams; //保存从当前路由中提取的信息结果
  //因为要尽量避免使用public方法，所以构建this.privateActions来引用私有actions
  protected privateActions = this.getPrivateActions({putList: this.putList, putCurrentItem: this.putCurrentItem});

  protected parseQuery(query: Record<string, string | undefined>): Record<string, string | undefined> {
    return query;
  }
  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): TRouteParams {
    const {pathname, searchQuery} = this.getRouter().location;
    const [, admin, subModule, curViewStr = ''] = pathToRegexp('/:admin/:subModule/:curView').exec(pathname) || [];
    const prefixPathname = ['', admin, subModule].join('/');
    const curView: TModuleState['curView'] | undefined = this.CurView[curViewStr] || undefined;
    const {pageCurrent = '', id, ...others} = searchQuery as Record<string, string | undefined>;
    const listSearch = {pageCurrent: parseInt(pageCurrent) || undefined, ...this.parseQuery(others)};
    return {prefixPathname, curView, itemId: id, listSearch: mergeDefaultParams(this.defaultListSearch, listSearch)} as TRouteParams;
  }

  //每次路由发生变化，都会引起Model重新挂载到Store
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  //在此钩子执行完成之前，本模块的View将不会Render
  //在此钩子中可以await数据请求，等所有数据拉取回来后，一次性Render
  //在此钩子中也可以await子模块的mount，等所有子模块都挂载好了，一次性Render
  //也可以不做任何await，直接Render，此时需要设计Loading界面
  public onMount(env: 'init' | 'route' | 'update'): void {
    this.routeParams = this.getRouteParams();
    const {prefixPathname, curView, listSearch, itemId} = this.routeParams;
    this.dispatch(this.privateActions._initState({prefixPathname, curView, listSearch} as TModuleState));
    if (curView === 'list') {
      this.dispatch(this.actions.fetchList(listSearch));
    } else if (curView && itemId) {
      this.dispatch(this.actions.fetchItem(itemId));
    }
  }

  @reducer
  public putList(listSearch: TModuleState['listSearch'], list: TModuleState['list'], listSummary: TModuleState['listSummary']): TModuleState {
    return {...this.state, listSearch, list, listSummary};
  }

  @effect('this.listLoading')
  public async fetchList(listSearchData?: TModuleState['listSearch']): Promise<void> {
    const listSearch = listSearchData || this.state.listSearch || this.defaultListSearch;
    const {list, listSummary} = await this.api.getList!(listSearch);
    this.dispatch(this.privateActions.putList(listSearch, list, listSummary));
  }

  @reducer
  public putCurrentItem(itemId = '', itemDetail: TModuleState['itemDetail']): TModuleState {
    return {...this.state, itemId, itemDetail};
  }

  @effect()
  public async fetchItem(itemId: string): Promise<void> {
    const item = await this.api.getItem!({id: itemId});
    this.dispatch(this.actions.putCurrentItem(itemId, item));
  }

  @effect()
  public async alterItems(ids: string[], data: Partial<TModuleState['itemDetail']>): Promise<void> {
    await this.api.alterItems!(ids, data);
    this.dispatch(this.actions.fetchList());
  }
}

export type ResourceActions = PickModelActions<BaseResource<BaseRouteParams, BaseModuleState>>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useSearch<TFormData>(pathname: string, defaultListSearch: Partial<TFormData>) {
  const onSearch = useCallback(
    (values: TFormData) => {
      GetClientRouter().push({pathname, searchQuery: excludeDefaultParams(defaultListSearch, {...values, pageCurrent: 1})});
    },
    [defaultListSearch, pathname]
  );
  const onReset = useCallback(() => {
    GetClientRouter().push({pathname, searchQuery: defaultListSearch});
  }, [defaultListSearch, pathname]);

  return {onSearch, onReset};
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useDetail(prefixPathname: string) {
  const onShowDetail = useCallback(
    (id: string) => {
      GetClientRouter().push({url: `${prefixPathname}/detail?id=${id}`, classname: '_dailog'}, 'window');
    },
    [prefixPathname]
  );
  const onShowEditor = useCallback(
    (id: string) => {
      GetClientRouter().push({url: `${prefixPathname}/edit?id=${id}`, classname: '_dailog'}, 'window');
    },
    [prefixPathname]
  );

  return {onShowDetail, onShowEditor};
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// export function useUpdate(dispatch:Dispatch, actions:ResourceActions) {
//   const onUpdate = useCallback((ids: string[], data: {[key: string]: any}) => {
//     dispatch(actions.alterItems(ids, data))
//   }, []);
// }
