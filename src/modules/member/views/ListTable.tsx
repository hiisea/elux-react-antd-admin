import {PlusOutlined} from '@ant-design/icons';
import MTable, {MColumns} from '@elux-admin-antd/stage/components/MTable';
import {useAlter, useShowDetail, useTableChange} from '@elux-admin-antd/stage/utils/resource';
import {Dispatch, LoadingState, connectRedux} from '@elux/react-web';
import {Button, Popconfirm, Tooltip} from 'antd';
import {FC, useMemo} from 'react';
import {APPState, GetActions} from '@/Global';
import {DGender, DRole, DStatus, ListItem, ListSearch, ListSummary, Status, defaultListSearch} from '../entity';

interface StoreProps {
  prefixPathname: string;
  selectedRows?: ListItem[];
  listSearch: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  listLoading?: LoadingState;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, listSearch, list, listSummary, listLoading} = state.member!;
  return {prefixPathname, listSearch, list, listSummary, listLoading};
};

const {member: memberActions} = GetActions('member');

const Component: FC<StoreProps & {dispatch: Dispatch}> = (props) => {
  const {prefixPathname, listSearch, list, listSummary, listLoading, dispatch} = props;

  const {selectedRows, deleteItems, alterItems, updateItem} = useAlter(dispatch, memberActions, props.selectedRows);
  const {onShowDetail, onShowEditor} = useShowDetail(prefixPathname);
  const onTableChange = useTableChange(prefixPathname, defaultListSearch, listSearch);

  const commActions = useMemo(
    () => (
      <>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onShowEditor('', updateItem)}>
          新建
        </Button>
      </>
    ),
    [onShowEditor, updateItem]
  );
  const batchActions = useMemo(
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

  const columns: MColumns<ListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'name',
      width: '10%',
      sorter: true,
    },
    {
      title: '呢称',
      dataIndex: 'nickname',
      width: '10%',
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: '10%',
      render: (val: string) => DRole.valueToLabel[val],
    },
    {
      title: '性别',
      dataIndex: 'gender',
      align: 'center',
      width: '100px',
      render: (val: string) => DGender.valueToLabel[val],
    },
    {
      title: '文章数',
      dataIndex: 'articles',
      align: 'center',
      sorter: true,
      width: '120px',
      render: (val: number, record) => <a>{val}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ellipsis: {showTitle: false},
      render: (email) => (
        <Tooltip placement="topLeft" title={email}>
          {email}
        </Tooltip>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdTime',
      width: '200px',
      sorter: true,
      timestamp: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '100px',
      render: (val: string) => <span className={`g-${val}`}>{DStatus.valueToLabel[val]}</span>,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: '200px',
      className: 'actions',
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
    },
  ];

  return (
    <MTable<ListItem>
      commonActions={commActions}
      batchActions={batchActions}
      onChange={onTableChange}
      columns={columns}
      listSearch={listSearch}
      dataSource={list}
      selectedRows={selectedRows}
      listSummary={listSummary}
      loading={listLoading === 'Start' || listLoading === 'Depth'}
    />
  );
};

export default connectRedux(mapStateToProps)(Component);
