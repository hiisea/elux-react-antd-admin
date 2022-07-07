import MTable, {MBatchActions, MColumns, MSelection} from '@elux-admin-antd/stage/components/MTable';
import {useTableChange} from '@elux-admin-antd/stage/utils/resource';
import {Link, LoadingState, connectRedux} from '@elux/react-web';
import {Tooltip} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {FC, ReactNode, useMemo} from 'react';
import {APPState} from '@/Global';
import {CurRender, DGender, DRole, DStatus, ListItem, ListSearch, ListSummary, defaultListSearch} from '../entity';

interface StoreProps {
  prefixPathname: string;
  curRender?: CurRender;
  listSearch: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  listLoading?: LoadingState;
}

interface OwnerProps {
  size?: 'small' | 'middle' | 'large';
  mergeColumns?: {[field: string]: MColumns<ListItem>};
  actionColumns?: ColumnProps<ListItem>;
  commonActions?: ReactNode;
  batchActions?: MBatchActions;
  selectedRows?: ListItem[];
  selection?: MSelection<ListItem>;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, listSearch, list, listSummary, listLoading, curRender} = state.member!;
  return {prefixPathname, listSearch, list, listSummary, listLoading, curRender};
};

const Component: FC<StoreProps & OwnerProps> = ({
  prefixPathname,
  size,
  mergeColumns,
  actionColumns,
  commonActions,
  batchActions,
  selection,
  listSearch,
  list,
  listSummary,
  listLoading,
  curRender,
  selectedRows,
}) => {
  const onTableChange = useTableChange(`${prefixPathname}/list/${curRender}`, defaultListSearch, listSearch);

  const columns = useMemo<MColumns<ListItem>[]>(() => {
    const cols: MColumns<ListItem>[] = [
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
        disable: curRender !== 'maintain',
        render: (val: number, record) => (
          <Link to={`/admin/article/list/index?author=${record.id}`} action="push" target="singleWindow" cname="_dialog">
            {val}
          </Link>
        ),
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
    ];
    if (actionColumns) {
      cols.push(actionColumns);
    }
    if (mergeColumns) {
      cols.forEach((col) => {
        const field = col.dataIndex as string;
        if (field && mergeColumns[field]) {
          Object.assign(col, mergeColumns[field]);
        }
      });
    }
    return cols;
  }, [curRender, mergeColumns, actionColumns]);

  return (
    <MTable<ListItem>
      size={size}
      commonActions={commonActions}
      batchActions={batchActions}
      onChange={onTableChange}
      columns={columns}
      listSearch={listSearch}
      dataSource={list}
      selectedRows={selectedRows}
      listSummary={listSummary}
      selection={selection}
      loading={listLoading === 'Start' || listLoading === 'Depth'}
    />
  );
};

export default connectRedux(mapStateToProps)(Component);
