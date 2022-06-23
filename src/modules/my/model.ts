//定义本模块的业务模型
import {BaseModel} from '@elux/react-web';
import {pathToRegexp} from 'path-to-regexp';
import {CurView} from './entity';

//定义本模块的状态结构
export interface ModuleState {
  curView?: CurView; //该字段用来表示当前路由下展示本模块的哪个View
}

//定义路由中的本模块感兴趣的信息
interface RouteParams {
  curView?: CurView;
}

//定义本模块的业务模型，必需继承BaseModel
//模型中的属性和方法尽量使用非public
export class Model extends BaseModel<ModuleState> {
  protected routeParams!: RouteParams; //保存从当前路由中提取的信息结果

  //因为要尽量避免使用public方法，所以构建this.privateActions来引用私有actions
  protected privateActions = this.getPrivateActions({});

  //提取当前路由中的本模块感兴趣的信息
  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, , , curViewStr = ''] = pathToRegexp('/:admin/:my/:curView').exec(pathname) || [];
    const curView: CurView | undefined = CurView[curViewStr] || undefined;
    return {curView};
  }

  //初始化或路由变化时都需要重新挂载Model
  //在此钩子中必需完成ModuleState的初始赋值，可以异步
  public onMount(): void {
    this.routeParams = this.getRouteParams();
    const {curView} = this.routeParams;
    const initState: ModuleState = {curView};
    //_initState是基类BaseModel中内置的一个reducer
    //this.dispatch是this.store.dispatch的快捷方式
    this.dispatch(this.privateActions._initState(initState));
  }
}
