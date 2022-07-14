import {BaseResource} from '@elux-admin-antd/stage/utils/resource';
import api from './api';
import {ArticleResource, defaultListSearch} from './entity';

export class Model extends BaseResource<ArticleResource> {
  protected api = api;
  protected defaultListSearch = defaultListSearch;
}
