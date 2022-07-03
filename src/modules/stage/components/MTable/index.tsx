import {AlignLeftOutlined, DownOutlined, InfoCircleOutlined, LeftOutlined} from '@ant-design/icons';
import {Button, Dropdown, Menu, Modal, Table} from 'antd';
import {ColumnProps, TableProps} from 'antd/lib/table';
import {ComponentType, Key, ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import DateTime from '../../components/DateTime';
import {BaseListSearch, BaseListSummary} from '../../utils/resource';
import styles from './index.module.less';

interface BatchAction {
  key: string;
  label: string;
  icon?: ReactNode;
  confirm?: boolean | ComponentType<{selected: number}>;
}

export type MColumns<T> = ColumnProps<T> & {timestamp?: boolean; disable?: boolean};

interface Props<T> extends TableProps<T> {
  className?: string;
  columns: MColumns<T>[];
  commonActions?: ReactNode;
  batchActions?: {actions: BatchAction[]; handler: (target: BatchAction, ids: Key[]) => void};
  listSummary?: BaseListSummary;
  listSearch?: BaseListSearch;
  selectedRowKeys?: Key[];
  selectedRows?: T[];
  selection?: {onChange?: (keys: Key[], rows: T[], maps: {[key: string]: T}) => void; selectLimit?: number | [number, number]};
}

const returnTotal = (total: number) => {
  return `共${total}条`;
};
const genLimitTips = (limit: number) => {
  return (
    <>
      还可选择 <em>{limit}</em> 项，
    </>
  );
};
function Component<T extends {[key: string]: any}>(props: Props<T>) {
  const {
    className = '',
    commonActions,
    listSummary = {pageCurrent: 1, pageSize: 10, totalItems: 0, totalPages: 0},
    listSearch = {},
    dataSource,
    rowKey = 'id',
    batchActions,
    selection,
    columns,
    ...otherPops
  } = props;
  const {pageCurrent, pageSize, totalItems} = listSummary;
  const {sorterField, sorterOrder} = listSearch;
  const {selectLimit = 0, onChange: onSelectedChange} = selection || {};
  const refData = useRef({selectedIds: [] as Key[], onSelectedChange});
  refData.current.onSelectedChange = onSelectedChange;
  const [selected, setSelected] = useState<{keys: Key[]; rows: T[]; maps: {[key: string]: T; [key: number]: T}}>({keys: [], rows: [], maps: {}});
  const [reviewMode, setReviewMode] = useState((props.selectedRowKeys || props.selectedRows || []).length > 0);

  const updateSelected = useCallback((keys: Key[], rows: T[], maps: {[key: string]: T}) => {
    refData.current.selectedIds = keys;
    setSelected({keys, rows, maps});
    if (keys.length === 0) {
      setReviewMode(false);
    }
    const onSelectedChange = refData.current.onSelectedChange;
    onSelectedChange && onSelectedChange(keys, rows, maps);
  }, []);

  useMemo(() => {
    const keys: Key[] = props.selectedRowKeys || (props.selectedRows || []).map((item) => item[rowKey as string]);
    const rows = props.selectedRows || (props.selectedRowKeys || []).map((key) => ({[rowKey as string]: key} as T));
    const maps = rows.reduce((pre, cur) => {
      pre[cur[rowKey as string]] = cur;
      return pre;
    }, {} as {[key: string]: T; [key: number]: T});
    updateSelected(keys, rows, maps);
  }, [props.selectedRowKeys, props.selectedRows, rowKey, updateSelected]);

  const limitMax = typeof selectLimit === 'number' ? selectLimit : selectLimit[1];

  const batchMenu: ReactNode = useMemo(() => {
    if (batchActions) {
      const onClick = ({key}: {key: string}) => {
        const {actions, handler} = batchActions;
        const target = actions.find((item) => item.key === key);
        if (target && target.confirm) {
          Modal.confirm({
            icon: <InfoCircleOutlined />,
            content:
              target.confirm === true ? (
                <div className={styles.batchConfirm}>
                  您确认要【<span className="batch">{target.label}</span>】所选择的 <a>{refData.current.selectedIds.length}</a> 项吗？
                  {typeof target.confirm === 'string' ? <div>{target.confirm}</div> : null}
                </div>
              ) : (
                <target.confirm selected={refData.current.selectedIds.length} />
              ),
            onOk: () => {
              setReviewMode(false);
              handler(target, refData.current.selectedIds);
            },
          });
        } else {
          handler(target!, refData.current.selectedIds);
        }
      };
      if (batchActions.actions.length === 1) {
        const item = batchActions.actions[0];
        return (
          <Button icon={<AlignLeftOutlined />} onClick={() => onClick({key: item.key})}>
            {item.label}
          </Button>
        );
      }
      return (
        <Dropdown overlay={<Menu onClick={onClick} items={batchActions.actions.map(({key, label, icon}) => ({key, label, icon}))}></Menu>}>
          <Button>
            批量操作 <DownOutlined />
          </Button>
        </Dropdown>
      );
    }
    return null;
  }, [batchActions]);

  useEffect(() => {
    setReviewMode(false);
  }, [dataSource]);

  const rowSelection: TableProps<T>['rowSelection'] | undefined = useMemo(() => {
    if (limitMax > -1 || batchMenu) {
      return {
        preserveSelectedRowKeys: true,
        columnWidth: 60,
        type: limitMax === 1 ? 'radio' : 'checkbox',
        selectedRowKeys: selected.keys,
        onChange: (selectedRowKeys, selectedRows) => {
          const rows: T[] = [];
          const maps: {[key: string]: T; [key: number]: T} = {};
          const keys = selectedRowKeys.map((key, index) => {
            const item = selectedRows[index] || selected.maps[key];
            rows.push(item);
            maps[key] = item;
            return key;
          });
          updateSelected(keys, rows, maps);
        },
      };
    } else {
      return undefined;
    }
  }, [batchMenu, limitMax, selected, updateSelected]);

  const clearSelected = useCallback(() => {
    updateSelected([], [], {});
  }, [updateSelected]);

  const pagination = useMemo(
    () => ({
      showTotal: returnTotal,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
      showSizeChanger: true,
      current: pageCurrent,
      pageSize,
      total: totalItems,
    }),
    [pageCurrent, pageSize, totalItems]
  );

  const columnList = useMemo(() => {
    return columns
      .filter((col) => !col.disable)
      .map((col) => {
        col = {...col};
        if (col.sorter && typeof col.sorter === 'boolean' && !col.sortOrder) {
          col.sortOrder = (sorterField === col.dataIndex && sorterOrder) || null;
        }
        if (col.timestamp && !col.render) {
          col.render = (text: string) => <DateTime date={text} />;
        }
        return col as ColumnProps<T>;
      });
  }, [columns, sorterField, sorterOrder]);

  return (
    <div className={styles.root + ' ' + className}>
      <div className="hd">
        {batchMenu && refData.current.selectedIds.length > 0 ? batchMenu : commonActions}
        {reviewMode && (
          <Button onClick={() => setReviewMode(false)} type="dashed" icon={<LeftOutlined />}>
            返回列表
          </Button>
        )}
        {refData.current.selectedIds.length > 0 && (
          <div className="ant-alert-info">
            <InfoCircleOutlined /> <span>已选择 </span>
            <a onClick={() => setReviewMode(true)} style={{fontWeight: 'bold'}}>
              {refData.current.selectedIds.length}
            </a>
            <span> 项，</span>
            {limitMax !== 0 && limitMax !== 1 ? genLimitTips(limitMax - refData.current.selectedIds.length) : ''}
            <a onClick={() => setReviewMode(!reviewMode)}>{reviewMode ? '返回' : '查看'}</a>
            <span> 或 </span>
            <a onClick={clearSelected}>清空选择</a>
          </div>
        )}
      </div>
      <Table<T>
        columns={columnList}
        pagination={reviewMode ? false : pagination}
        rowSelection={rowSelection}
        dataSource={reviewMode ? selected.rows : dataSource}
        rowKey={rowKey}
        {...otherPops}
      />
    </div>
  );
}

export default memo(Component) as typeof Component;
