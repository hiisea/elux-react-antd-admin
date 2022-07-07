import MSearch from '@elux-admin-antd/stage/components/MSearch';
import {useSearch} from '@elux-admin-antd/stage/utils/resource';
import {SearchFromItems} from '@elux-admin-antd/stage/utils/tools';
import {Dispatch, connectRedux} from '@elux/react-web';
import {Input, Select} from 'antd';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurRender, DRole, DStatus, ListSearch, ListSearchFormData, defaultListSearch} from '../entity';

const formItems: SearchFromItems<ListSearchFormData> = [
  {name: 'name', label: '用户名', formItem: <Input allowClear placeholder="请输入关键字" />},
  {name: 'nickname', label: '呢称', formItem: <Input allowClear placeholder="请输入呢称" />},
  {
    name: 'status',
    label: '状态',
    formItem: <Select allowClear placeholder="请选择用户状态" options={DStatus.options} />,
  },
  {
    name: 'role',
    label: '角色',
    formItem: <Select allowClear placeholder="请选择用户状态" options={DRole.options} />,
  },
  {
    name: 'email',
    label: 'Email',
    formItem: <Input allowClear placeholder="请输入Email" />,
  },
];

interface StoreProps {
  prefixPathname: string;
  curRender?: CurRender;
  listSearch: ListSearch;
  listConfig?: {showSearch?: {[key: string]: any}};
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, curRender, listConfig, listSearch} = state.member!;
  return {prefixPathname, curRender, listConfig, listSearch};
};

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({prefixPathname, curRender, listSearch}) => {
  const {onSearch, onReset} = useSearch<ListSearchFormData>(`${prefixPathname}/list/${curRender}`, defaultListSearch);

  return <MSearch<ListSearchFormData> values={listSearch} expand={!!listSearch.email} items={formItems} onSearch={onSearch} onReset={onReset} />;
};

export default connectRedux(mapStateToProps)(Component);
