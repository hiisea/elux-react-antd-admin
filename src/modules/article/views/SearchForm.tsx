import MSearch from '@elux-admin-antd/stage/components/MSearch';
import MSelect from '@elux-admin-antd/stage/components/MSelect';
import {useSearch} from '@elux-admin-antd/stage/utils/resource';
import {SearchFromItems} from '@elux-admin-antd/stage/utils/tools';
import {Dispatch, connectRedux} from '@elux/react-web';
import {Input, Select} from 'antd';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurRender, DStatus, ListSearch, ListSearchFormData, defaultListSearch} from '../entity';

const authorSourceUrl: string = '/admin/member/list/selector?role=editor&listConfig=' + JSON.stringify({selectLimit: 2});

const formItems: SearchFromItems<ListSearchFormData> = [
  {name: 'title', label: '标题', formItem: <Input allowClear placeholder="请输入关键字" />},
  {
    name: 'author',
    label: '作者',
    formItem: <MSelect placeholder="请选择作者" source={authorSourceUrl}></MSelect>,
  },
  {name: 'editor', label: '责任编辑', formItem: <Input allowClear placeholder="请输入责任编辑" />},
  {
    name: 'status',
    label: '状态',
    formItem: <Select allowClear placeholder="请选择审核状态" options={DStatus.options} />,
  },
];

interface StoreProps {
  prefixPathname: string;
  curRender?: CurRender;
  listSearch: ListSearch;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, curRender, listSearch} = state.article!;
  return {prefixPathname, curRender, listSearch};
};

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({prefixPathname, curRender, listSearch}) => {
  const {onSearch, onReset} = useSearch<ListSearchFormData>(`${prefixPathname}/list/${curRender}`, defaultListSearch);

  return <MSearch<ListSearchFormData> values={listSearch} items={formItems} onSearch={onSearch} onReset={onReset} />;
};

export default connectRedux(mapStateToProps)(Component);
