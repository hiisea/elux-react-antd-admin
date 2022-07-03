import {BaseResource} from '@elux-admin-antd/stage/utils/resource';
import {CurView, MemberResource, api, defaultListSearch} from './entity';

export class Model extends BaseResource<MemberResource> {
  protected CurView = CurView;
  protected api = api;
  protected defaultListSearch = defaultListSearch;
}
