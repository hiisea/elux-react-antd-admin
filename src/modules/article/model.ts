//定义本模块的业务模型
import {BaseModel, effect, reducer} from '@elux/react-web';
import {pathToRegexp} from 'path-to-regexp';
import {APPState} from '@/Global';
import {CommonErrorCode, CustomError} from '@/utils/errors';
import {mergeDefaultParams} from '@/utils/tools';
import {CurView, ItemDetail, ListItem, ListSearch, ListSummary, api, defaultListSearch} from './entity';

//定义本模块的状态结构
//通常都是`列表/详情/编辑`结构
export interface ModuleState {
  prefixPathname: string;
  curView?: CurView; //该字段用来表示当前路由下展示本模块的哪个View
  listSearch: ListSearch; //该字段用来记录列表时搜索条件
  list?: ListItem[]; //该字段用来记录列表
  listSummary?: ListSummary; //该字段用来记录当前列表的摘要信息
  itemId?: string; //该字段用来记录某条记录的ID
  itemDetail?: ItemDetail; //该字段用来记录某条记录的详情
}

//每个不同的模块都可以在路由中提取自己想要的信息
interface RouteParams {
  prefixPathname: string;
  curView?: CurView;
  listSearch: ListSearch;
  itemId?: string;
}

//定义本模块的业务模型，必需继承BaseModel
//模型中的属性和方法尽量使用非public
export class Model extends BaseModel<ModuleState, APPState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  //因为要尽量避免使用public方法，所以构建this.privateActions来引用私有actions
  protected privateActions = this.getPrivateActions({putList: this.putList, putCurrentItem: this.putCurrentItem});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname, searchQuery} = this.getRouter().location;
    const [, admin, article, curViewStr = ''] = pathToRegexp('/:admin/:article/:curView').exec(pathname) || [];
    const prefixPathname = ['', admin, article].join('/');
    const curView: CurView | undefined = CurView[curViewStr] || undefined;
    const {pageCurrent = '', keyword, id} = searchQuery as Record<string, string | undefined>;
    const listSearch = {pageCurrent: parseInt(pageCurrent) || undefined, keyword};
    return {prefixPathname, curView, itemId: id, listSearch: mergeDefaultParams(defaultListSearch, listSearch)};
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
    this.dispatch(this.privateActions._initState({prefixPathname, curView, listSearch}));
    if (curView === 'list') {
      this.dispatch(this.actions.fetchList(listSearch));
    } else if (curView && itemId) {
      this.dispatch(this.actions.fetchItem(itemId));
    }
  }

  //定义一个reducer，用来更新列表数据
  @reducer
  protected putList(listSearch: ListSearch, list: ListItem[], listSummary: ListSummary): ModuleState {
    return {...this.state, listSearch, list, listSummary};
  }

  //定义一个reducer，用来更新详情数据
  @reducer
  protected putCurrentItem(itemId: string, itemDetail: ItemDetail): ModuleState {
    return {...this.state, itemId, itemDetail};
  }

  //定义一个effect，用来执行删除的业务逻辑
  //effect()未加参数，默认等于effect('stage.globalLoading')
  //也可以在ModuleState中增加一个loading状态，effect('this.deleteLoading')
  @effect()
  public async deleteItem(id: string): Promise<void> {
    //删除需要登录
    if (!this.hasLogin()) {
      throw new CustomError(CommonErrorCode.unauthorized, '请登录！', this.getRouter().location.url, true);
    }
    await api.deleteItem({id});
    this.dispatch(this.actions.fetchList());
  }

  //定义一个effect，用来执行修改的业务逻辑
  //effect()未加参数，默认等于effect('stage.globalLoading')
  @effect()
  public async updateItem(item: ItemDetail): Promise<void> {
    const router = this.getRouter();
    await api.updateItem(item);
    await this.getRouter().back(1, 'window');
    router.getActivePage().store.dispatch(this.actions.fetchList());
  }

  //定义一个effect，用来执行创建的业务逻辑
  //effect()未加参数，默认等于effect('stage.globalLoading')
  @effect()
  public async createItem(item: ItemDetail): Promise<void> {
    const router = this.getRouter();
    await api.createItem(item);
    await router.back(1, 'window');
    router.replace({pathname: `${this.state.prefixPathname}/list`, searchQuery: {pageCurrent: 1}});
  }

  //定义一个effect，用来执行列表查询的业务逻辑
  //effect()未加参数，默认等于effect('stage.globalLoading')
  @effect()
  public async fetchList(listSearchData?: ListSearch): Promise<void> {
    const listSearch = listSearchData || this.state.listSearch || defaultListSearch;
    const {list, listSummary} = await api.getList(listSearch);
    this.dispatch(this.privateActions.putList(listSearch, list, listSummary));
  }

  //定义一个effect，用来执行获取详情的业务逻辑
  //effect()未加参数，默认等于effect('stage.globalLoading')
  @effect()
  public async fetchItem(itemId: string): Promise<void> {
    const item = await api.getItem({id: itemId});
    this.dispatch(this.privateActions.putCurrentItem(itemId, item));
  }

  private hasLogin(): boolean {
    return this.getRootState().stage!.curUser.hasLogin;
  }
}
