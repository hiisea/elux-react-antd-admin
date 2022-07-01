import {BaseResource} from '@elux-admin-antd/stage/utils/resource';
import {CurView, ModuleState, RouteParams, api, defaultListSearch} from './entity';

export class Model extends BaseResource<RouteParams, ModuleState> {
  protected CurView = CurView;
  protected api = api;
  protected defaultListSearch = defaultListSearch;
}
