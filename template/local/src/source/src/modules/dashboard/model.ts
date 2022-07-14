import {BaseModel} from '@elux/react-web';
import {pathToRegexp} from 'path-to-regexp';
import {CurView} from './entity';

export interface ModuleState {
  curView?: CurView;
}

interface RouteParams {
  curView?: CurView;
}

export class Model extends BaseModel<ModuleState> {
  protected routeParams!: RouteParams;
  protected privateActions = this.getPrivateActions({});

  protected getRouteParams(): RouteParams {
    const {pathname} = this.getRouter().location;
    const [, , , curViewStr = ''] = pathToRegexp('/:admin/:dashboard/:curView').exec(pathname) || [];
    const curView: CurView | undefined = CurView[curViewStr] || undefined;
    return {curView};
  }

  public onMount(): void {
    this.routeParams = this.getRouteParams();
    const {curView} = this.routeParams;
    const initState: ModuleState = {curView};
    this.dispatch(this.privateActions._initState(initState));
  }
}
