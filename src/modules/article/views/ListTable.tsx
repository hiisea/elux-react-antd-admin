import MTable, {MBatchActions, MColumns, MSelection} from '@elux-admin-antd/stage/components/MTable';
import {DialogPageClassname} from '@elux-admin-antd/stage/utils/const';
import {useSingleWindow, useTableChange, useTableSize} from '@elux-admin-antd/stage/utils/resource';
import {splitIdName} from '@elux-admin-antd/stage/utils/tools';
import {Link, LoadingState, connectStore} from '@elux/react-web';
import {Tooltip} from 'antd';
import {ColumnProps} from 'antd/lib/table';
import {FC, ReactNode, useMemo} from 'react';
import {APPState} from '@/Global';
import {DStatus, ListItem, ListSearch, ListSummary, Status, defaultListSearch} from '../entity';

interface StoreProps {
  listSearch: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  listLoading?: LoadingState;
}

interface OwnerProps {
  listPathname: string;
  mergeColumns?: {[field: string]: MColumns<ListItem>};
  actionColumns?: ColumnProps<ListItem>;
  commonActions?: ReactNode;
  batchActions?: MBatchActions;
  selectedRows?: Partial<ListItem>[];
  selection?: MSelection<ListItem>;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {listSearch, list, listSummary, listLoading} = state.article!;
  return {listSearch, list, listSummary, listLoading};
};

const Component: FC<StoreProps & OwnerProps> = ({
  listPathname,
  mergeColumns,
  actionColumns,
  commonActions,
  batchActions,
  selection,
  listSearch,
  list,
  listSummary,
  listLoading,
  selectedRows,
}) => {
  const onTableChange = useTableChange(listPathname, defaultListSearch, listSearch);
  const singleWindow = useSingleWindow();
  const tableSize = useTableSize();

  const columns = useMemo<MColumns<ListItem>[]>(() => {
    const cols: MColumns<ListItem>[] = [
      {
        title: '标题',
        dataIndex: 'title',
        ellipsis: {showTitle: false},
        render: (title, record) => (
          <Tooltip placement="topLeft" title={title}>
            <Link to={`/admin/article/item/detail/${record.id}`} action="push" target={singleWindow} cname={DialogPageClassname}>
              {title}
            </Link>
          </Tooltip>
        ),
      },
      {
        title: '作者',
        dataIndex: 'author',
        width: '10%',
        sorter: true,
        render: (author: string) => {
          const {id, name} = splitIdName(author);
          return (
            <Link to={`/admin/member/item/detail/${id}`} action="push" target={singleWindow} cname={DialogPageClassname}>
              {name}
            </Link>
          );
        },
      },
      {
        title: '责任编辑',
        dataIndex: 'editors',
        width: '20%',
        className: 'g-actions',
        render: (editors: string[]) =>
          editors.map((editor) => {
            const {id, name} = splitIdName(editor);
            return (
              <Link key={id} to={`/admin/member/item/detail/${id}`} action="push" target={singleWindow} cname={DialogPageClassname}>
                {name}
              </Link>
            );
          }),
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        width: '200px',
        sorter: true,
        timestamp: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '100px',
        render: (val: string) => (
          <span className={`g-${val === Status.审核拒绝 ? 'disable' : val === Status.审核通过 ? 'enable' : ''}`}>{DStatus.valueToLabel[val]}</span>
        ),
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
  }, [mergeColumns, actionColumns, singleWindow]);

  return (
    <MTable<ListItem>
      size={tableSize}
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

export default connectStore(mapStateToProps)(Component);
