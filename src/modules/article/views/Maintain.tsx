import {PlusOutlined} from '@ant-design/icons';
import {MBatchActions} from '@elux-admin-antd/stage/components/MTable';
import {useAlter, useShowDetail} from '@elux-admin-antd/stage/utils/resource';
import {Dispatch, DocumentHead, connectStore} from '@elux/react-web';
import {Button, Dropdown, Menu, Popconfirm} from 'antd';
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
  const {prefixPathname, curRender, listSearch} = state.article!;
  return {prefixPathname, curRender, listSearch};
};

const {article: articleActions} = GetActions('article');

const Component: FC<StoreProps & {dispatch: Dispatch}> = (props) => {
  const {prefixPathname, curRender, listSearch, dispatch} = props;

  const {selectedRows, deleteItems, alterItems, updateItem} = useAlter<ListItem>(dispatch, articleActions);
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
        {key: 'resolved', label: '批量通过', confirm: true},
        {key: 'rejected', label: '批量拒绝', confirm: true},
      ],
      handler: (item: {key: string}, ids: (string | number)[]) => {
        if (item.key === 'delete') {
          deleteItems(ids as string[]);
        } else if (item.key === 'resolved') {
          alterItems(ids as string[], {status: Status.审核通过});
        } else if (item.key === 'rejected') {
          alterItems(ids as string[], {status: Status.审核拒绝});
        }
      },
    }),
    [alterItems, deleteItems]
  );

  const actionColumns: ColumnProps<ListItem> = {
    title: '操作',
    dataIndex: 'id',
    width: '200px',
    align: 'center',
    render: (id: string, record) => {
      return (
        <div className="g-table-actions">
          <a onClick={() => onShowDetail(id)}>详细</a>
          <Dropdown
            overlay={
              <Menu
                onClick={({key}: any) => {
                  alterItems([id], {status: key});
                }}
                items={[
                  {label: '审核通过', key: Status.审核通过},
                  {label: '审核拒绝', key: Status.审核拒绝},
                ]}
              ></Menu>
            }
          >
            <a>审核</a>
          </Dropdown>
          <a onClick={() => onShowEditor(id, updateItem)}>修改</a>
          <Popconfirm placement="topRight" title="您确定要删除该条数据吗？" onConfirm={() => deleteItems(id)}>
            <a>删除</a>
          </Popconfirm>
        </div>
      );
    },
  };

  return (
    <div className="g-page-content">
      <DocumentHead title="文章管理" />
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
