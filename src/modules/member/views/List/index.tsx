import {PlusOutlined} from '@ant-design/icons';
import MSearch from '@elux-admin-antd/stage/components/MSearch';
import MTable, {MColumns} from '@elux-admin-antd/stage/components/MTable';
import {useDetail, useSearch} from '@elux-admin-antd/stage/utils/resource';
import {SearchFromItems, excludeDefaultParams} from '@elux-admin-antd/stage/utils/tools';
import {Dispatch, DocumentHead, Link, LoadingState, connectRedux} from '@elux/react-web';
import {Button, Input, Popconfirm, Select, Tooltip} from 'antd';
import {FC, memo, useCallback, useMemo} from 'react';
import {APPState, GetActions, useRouter} from '@/Global';
import {DGender, DRole, DStatus, ListItem, ListSearch, ListSearchFormData, ListSummary, Status, defaultListSearch} from '../../entity';
import styles from './index.module.less';

const formItems: SearchFromItems<ListSearchFormData> = [
  {name: 'name', label: '用户名', formItem: <Input allowClear placeholder="请输入用户名" />},
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
  selectedRows?: ListItem[];
  listSearch: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  listLoading?: LoadingState;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, listSearch, list, listSummary, listLoading} = state.member!;
  //const {selectedRows} = thisModule;
  // const  = member;
  return {prefixPathname, listSearch, list, listSummary, listLoading};
};

const {member: memberActions} = GetActions('member');

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({prefixPathname, listSearch, list, listSummary, listLoading, dispatch}) => {
  //const setectedKeys = useMemo(()=>{})
  const commActions = useMemo(
    () => (
      <>
        <Button type="primary" icon={<PlusOutlined />}>
          新建
        </Button>
      </>
    ),
    []
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
          //onDeleteList();
        } else if (item.key === 'enable') {
          dispatch(memberActions.alterItems(ids as string[], {status: Status.启用}));
        } else if (item.key === 'disable') {
          dispatch(memberActions.alterItems(ids as string[], {status: Status.禁用}));
        }
      },
    }),
    [dispatch]
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
            <a onClick={() => dispatch(memberActions.alterItems([id], {status: record.status === Status.启用 ? Status.禁用 : Status.启用}))}>
              {record.status === Status.启用 ? '禁用' : '启用'}
            </a>
            <a onClick={() => onShowEditor(id)}>修改</a>
            <Popconfirm placement="topRight" title="您确定要删除该条数据吗？">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const router = useRouter();
  const onPageChange = useCallback(
    (pageCurrent: number) => {
      router.push({
        pathname: `${prefixPathname}/list`,
        searchQuery: excludeDefaultParams(defaultListSearch, {...listSearch, pageCurrent}),
      });
    },
    [router, prefixPathname, listSearch]
  );

  const onChange = (pagination: {current: number; pageSize: number}) => {
    console.log(pagination);
    onPageChange(pagination.current);
  };

  const {onSearch, onReset} = useSearch<ListSearchFormData>(`${prefixPathname}/list`, defaultListSearch);
  const {onShowDetail, onShowEditor} = useDetail(prefixPathname);

  return (
    <div className={`${styles.root} g-page-content`}>
      <DocumentHead title="用户列表" />
      <div>
        <MSearch<ListSearchFormData> values={listSearch} expand={!!listSearch.email} items={formItems} onSearch={onSearch} onReset={onReset} />
        <MTable<ListItem>
          commonActions={commActions}
          batchActions={batchActions}
          onChange={onChange as any}
          columns={columns}
          listSearch={listSearch}
          dataSource={list}
          listSummary={listSummary}
          loading={listLoading === 'Start' || listLoading === 'Depth'}
        />
      </div>
    </div>
  );
};

export default connectRedux(mapStateToProps)(Component);
