import {PlusOutlined} from '@ant-design/icons';
import {MBatchActions} from '@elux-admin-antd/stage/components/MTable';
import {useAlter, useShowDetail} from '@elux-admin-antd/stage/utils/resource';
import {Dispatch, DocumentHead, connectStore} from '@elux/react-web';
import {Button, Popconfirm} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {FC, ReactNode, useMemo} from 'react';
import {APPState, GetActions} from '@/Global';
import {ListItem, ListSearch, Status} from '../entity';
import ListTable from './ListTable';
import SearchForm from './SearchForm';

interface StoreProps {
  prefixPathname: string;
  listSearch: ListSearch;
  curRender?: string;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, curRender, listSearch} = state.member!;
  return {prefixPathname, curRender, listSearch};
};

const {member: memberActions} = GetActions('member');

const Component: FC<StoreProps & {dispatch: Dispatch}> = (props) => {
  const {prefixPathname, curRender, listSearch, dispatch} = props;

  const {selectedRows, deleteItems, alterItems, updateItem} = useAlter<ListItem>(dispatch, memberActions);
  const {onShowDetail, onShowEditor} = useShowDetail(prefixPathname);

  const commActions = useMemo<ReactNode>(
    () => (
      <Button type="primary" icon={<PlusOutlined />} onClick={() => onShowEditor('', updateItem)}>
        新建
      </Button>
    ),
    [onShowEditor, updateItem]
  );
  const batchActions = useMemo<MBatchActions>(
    () => ({
      actions: [
        {key: 'delete', label: '批量删除', confirm: true},
        {key: 'enable', label: '批量启用', confirm: true},
        {key: 'disable', label: '批量禁用', confirm: true},
      ],
      handler: (item: {key: string}, ids: (string | number)[]) => {
        if (item.key === 'delete') {
          deleteItems(ids as string[]);
        } else if (item.key === 'enable') {
          alterItems(ids as string[], {status: Status.启用});
        } else if (item.key === 'disable') {
          alterItems(ids as string[], {status: Status.禁用});
        }
      },
    }),
    [alterItems, deleteItems]
  );

  const actionColumns: ColumnProps<ListItem> = useMemo(
    () => ({
      title: '操作',
      dataIndex: 'id',
      width: '200px',
      align: 'center',
      render: (id: string, record) => {
        return (
          <div className="g-table-actions">
            <a onClick={() => onShowDetail(id)}>详细</a>
            <a onClick={() => alterItems(id, {status: record.status === Status.启用 ? Status.禁用 : Status.启用})}>
              {record.status === Status.启用 ? '禁用' : '启用'}
            </a>
            <a onClick={() => onShowEditor(id, updateItem)}>修改</a>
            <Popconfirm placement="topRight" title="您确定要删除该条数据吗？" onConfirm={() => deleteItems(id)}>
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    }),
    [alterItems, deleteItems, onShowDetail, onShowEditor, updateItem]
  );

  return (
    <div className="g-page-content">
      <DocumentHead title="用户管理" />
      <div>
        <SearchForm listSearch={listSearch} listPathname={`${prefixPathname}/list/${curRender}`} />
        <ListTable
          commonActions={commActions}
          batchActions={batchActions}
          actionColumns={actionColumns}
          selectedRows={selectedRows}
          listPathname={`${prefixPathname}/list/${curRender}`}
        />
      </div>
    </div>
  );
};

export default connectStore(mapStateToProps)(Component);
