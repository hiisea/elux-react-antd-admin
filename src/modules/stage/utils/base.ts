import {LoadingState} from '@elux/react-web';

export interface IRequest<Req, Res> {
  Request: Req;
  Response: Res;
}
export type BaseCurView = 'list' | 'item';
export type BaseCurRender = 'maintain' | 'index' | 'selector' | 'edit' | 'detail';
export interface BaseListSearch {
  pageCurrent?: number;
  pageSize?: number;
  sorterOrder?: 'ascend' | 'descend';
  sorterField?: string;
}

export interface BaseListItem {
  id: string;
}

export interface BaseListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  categorys?: {id: string; name: string; ids: string[]}[];
}

export interface BaseItemDetail extends BaseListItem {}

export interface BaseLocationState<TListItem = BaseListItem> {
  selectLimit?: number | [number, number];
  selectedRows?: Partial<TListItem>[];
  showSearch?: boolean;
  fixedSearch?: {[field: string]: any};
  onEditSubmit?: (id: string, data: Record<string, any>) => Promise<void>;
  onSelectedSubmit?: (rows: Partial<TListItem>[]) => void;
}
export interface BaseModuleState<TDefineResource extends DefineResource = DefineResource> {
  prefixPathname: string;
  curView?: TDefineResource['CurView'];
  curRender?: TDefineResource['CurRender'];
  listSearch: TDefineResource['ListSearch'];
  list?: TDefineResource['ListItem'][];
  listSummary?: TDefineResource['ListSummary'];
  listLoading?: LoadingState;
  itemId?: string;
  itemDetail?: TDefineResource['ItemDetail'];
}

export interface BaseRouteParams<TDefineResource extends DefineResource = DefineResource> {
  prefixPathname: string;
  curView?: TDefineResource['CurView'];
  curRender?: TDefineResource['CurRender'];
  listSearch?: TDefineResource['ListSearch'];
  itemId?: string;
}

export interface BaseApi {
  getList?(params: BaseListSearch): Promise<{list: BaseListItem[]; listSummary: BaseListSummary}>;
  getItem?(params: {id: string}): Promise<BaseItemDetail>;
  alterItems?(params: {id: string | string[]; data: Record<string, any>}): Promise<void>;
  updateItem?(params: {id: string; data: any}): Promise<void>;
  createItem?(params: Record<string, any>): Promise<{id: string}>;
  deleteItems?(params: {id: string | string[]}): Promise<void>;
}

export interface DefineResource {
  RouteParams: BaseRouteParams;
  ModuleState: BaseModuleState;
  ListSearch: BaseListSearch;
  ListItem: BaseListItem;
  ListSummary: BaseListSummary;
  CurView: BaseCurView;
  CurRender: BaseCurRender;
  ItemDetail: BaseItemDetail;
  UpdateItem: any;
  CreateItem: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function enumOptions<T extends {[key: string]: any}>(data: T) {
  const options: {value: string; label: string}[] = [];
  const labelToValue: {[key in keyof T]: T[key]} = {} as any;
  const valueToLabel: {[key in T[keyof T]]: string} = {} as any;
  Object.keys(data).forEach((label) => {
    options.push({label, value: data[label]});
    (labelToValue as any)[label] = data[label];
    valueToLabel[data[label]] = label;
  });
  return {
    valueToLabel,
    labelToValue,
    options,
  };
}

export function arrayToMap<T>(arr: T[], key = 'id'): {[key: string]: T} {
  return arr.reduce((pre, cur) => {
    pre[cur[key]] = cur;
    return pre;
  }, {});
}
