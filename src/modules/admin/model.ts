//定义本模块的业务模型
import {BaseModel, effect, reducer} from '@elux/react-web';
import {pathToRegexp} from 'path-to-regexp';
import {APPState} from '@/Global';
import api from './api';
import {MenuData, Notices, SubModule} from './entity';
import type {Tab, TabData} from './entity';

//定义本模块的状态结构
export interface ModuleState {
  subModule?: SubModule; //该字段用来记录当前路由下展示哪个子Module
  notices?: Notices; //该字段用来记录实时通知信息
  siderCollapsed?: boolean; //左边菜单是否折叠
  tabEdit?: Tab;
  tabData: TabData;
  curTab: Tab;
  menuData: MenuData;
  menuSelected: {selected: string[]; open: string[]};
  //该字段用来记录当前Page是否用Dialog模式展示(非全屏)
  //Dialog模式时将不渲染Layout
  dialogMode: boolean;
}

//定义路由中的本模块感兴趣的信息
export interface RouteParams {
  subModule?: SubModule;
}

export class Model extends BaseModel<ModuleState, APPState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  //因为要尽量避免使用public方法，所以构建this.privateActions来引用私有actions
  protected privateActions = this.getPrivateActions({});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, , subModuleStr = ''] = pathToRegexp('/:admin/:subModule', undefined, {end: false}).exec(pathname) || [];
    const subModule: SubModule | undefined = SubModule[subModuleStr] || undefined;
    return {subModule};
  }

  //初始化或路由变化时都需要重新挂载Model
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  public onMount(env: 'init' | 'route' | 'update'): void | Promise<void> {
    this.routeParams = this.getRouteParams();
    const {
      location: {classname},
    } = this.getRouter();
    const {subModule} = this.routeParams;
    const curTab = this.getCurTab();
    const dialogMode = classname.startsWith('_');
    const prevState = this.getPrevState();
    const initCallback = ([tabData, menuData]: [TabData, MenuData]) => {
      const menuSelected = this.matchMenu(menuData);
      const initState: ModuleState = {
        ...prevState,
        curTab,
        subModule,
        dialogMode,
        tabData,
        menuData,
        menuSelected,
        tabEdit: undefined,
      };
      this.dispatch(this.privateActions._initState(initState));
    };
    if (prevState) {
      //复用之前的state
      return initCallback([prevState.tabData, prevState.menuData]);
    } else {
      return Promise.all([api.getTabData(), api.getMenuData()]).then(initCallback);
    }
  }

  @effect(null)
  public clickMenu(key: string): void {
    const link = this.state.menuData.keyToLink[key];
    if (link) {
      if (link.startsWith('/')) {
        this.getRouter().push({url: link}, 'page');
      } else {
        window.open(link);
      }
    }
  }

  @reducer
  public putSiderCollapsed(siderCollapsed: boolean): ModuleState {
    return {...this.state, siderCollapsed};
  }

  @effect(null)
  public clickTab(id: string): void {
    if (id) {
      const item = this.state.tabData.maps[id];
      if (id === this.state.curTab.id) {
        this.dispatch(this.privateActions._updateState('showTabEditor', {tabEdit: item}));
      } else {
        this.getRouter().push({url: item.url}, 'page');
      }
    } else {
      this.dispatch(this.privateActions._updateState('showTabEditor', {tabEdit: {...this.state.curTab, title: document.title}}));
    }
  }

  @reducer
  public closeTabEditor(): ModuleState {
    return {...this.state, tabEdit: undefined};
  }

  @effect(null)
  public async updateTab(item: Tab): Promise<void> {
    let {list, maps} = this.state.tabData;
    if (maps[item.id]) {
      list = list.map((tab) => (tab.id === item.id ? item : tab));
    } else {
      list = [item, ...list];
    }
    maps = {...maps, [item.id]: item};
    const tabData = {list, maps};
    await api.updateTabData(tabData);
    this.dispatch(this.privateActions._updateState('updateTab', {tabData, tabEdit: undefined}));
  }

  @effect(null)
  public async deleteTab(id: string): Promise<void> {
    let {list, maps} = this.state.tabData;
    if (maps[id]) {
      list = list.filter((tab) => tab.id !== id);
      maps = {...maps};
      delete maps[id];
      const tabData = {list, maps};
      await api.updateTabData(tabData);
      this.dispatch(this.privateActions._updateState('updateTab', {tabData}));
    }
  }

  private getCurTab(): Tab {
    const {pathname, search, url} = this.getRouter().location;
    let id = pathname;
    if (search) {
      id += `?${search.split('&').sort().join('&')}`;
    }
    return {id, url, title: ''};
  }

  private matchMenu({matchToKey, keyToParents}: MenuData): {selected: string[]; open: string[]} {
    const pathname = this.getRouter().location.pathname;
    for (const rule in matchToKey) {
      if (pathname.startsWith(rule)) {
        const selected = matchToKey[rule];
        return {selected: [selected], open: [...keyToParents[selected]]};
      }
    }
    return {selected: [], open: []};
  }
  private hasLogin(): boolean {
    return this.getRootState().stage!.curUser.hasLogin;
  }

  private getNotices = () => {
    if (this.hasLogin()) {
      api.getNotices().then((notices) => {
        curNotices = notices;
        this.dispatch(this.privateActions._updateState('updataNotices', {notices}));
      });
    }
  };

  //页面被激活(变为显示页面)时调用
  onActive(): void {
    if (curNotices && this.state.notices !== curNotices) {
      this.dispatch(this.privateActions._updateState('updataNotices', {notices: curNotices}));
    }
    if (!curLoopTask) {
      curLoopTask = this.getNotices;
      curLoopTask();
    } else {
      curLoopTask = this.getNotices;
    }
  }
}

let curLoopTask: (() => void) | undefined;
let curNotices: Notices | undefined;
setInterval(() => curLoopTask && curLoopTask(), 10000);
