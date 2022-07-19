import {AlignLeftOutlined, CheckOutlined, DownOutlined, InfoCircleOutlined, LeftOutlined} from '@ant-design/icons';
import {Alert, Button, Dropdown, Menu, Modal, Table, message} from 'antd';
import {ColumnProps, TableProps} from 'antd/lib/table';
import {ComponentType, Key, ReactNode, memo, useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from '@/Global';
import DateTime from '../../components/DateTime';
import {BaseListSearch, BaseListSummary, BaseLocationState} from '../../utils/base';
import styles from './index.module.less';

export interface BatchAction {
  key: string;
  label: string;
  icon?: ReactNode;
  confirm?: boolean | ComponentType<{selected: number}>;
}

export type MBatchActions = {actions: BatchAction[]; handler: (target: BatchAction, ids: Key[]) => void};

export type MColumns<T> = ColumnProps<T> & {timestamp?: boolean; disable?: boolean};

export type MSelection<T> = {
  onChange?: (data: {keys: Key[]; rows: Partial<T>[]; maps: {[key: Key]: Partial<T>}}) => void;
  limit?: number | [number, number];
  autoSubmit?: boolean;
};

interface Props<T> extends TableProps<T> {
  className?: string;
  columns: MColumns<T>[];
  commonActions?: ReactNode;
  batchActions?: MBatchActions;
  listSummary?: BaseListSummary;
  listSearch?: BaseListSearch;
  selectedRowKeys?: Key[];
  selectedRows?: Partial<T>[];
  selection?: MSelection<T>;
}

function computeSelected<T>(rowKey: Key, selectedRowKeys?: Key[], selectedRows?: Partial<T>[]) {
  const keys = selectedRowKeys || (selectedRows || []).map((item) => item[rowKey as string] as Key);
  const rows = selectedRows || (selectedRowKeys || []).map((key) => ({[rowKey as string]: key} as any));
  const maps = rows.reduce((data, cur) => {
    data[cur[rowKey as string] as Key] = cur;
    return data;
  }, {} as {[key: Key]: Partial<T>});
  return {keys, rows, maps};
}
function returnTotal(total: number) {
  return `共${total}条`;
}
function Component<T extends {[key: string]: any}>(props: Props<T>) {
  const {
    selectedRowKeys,
    selectedRows,
    dataSource,
    selection,
    batchActions,
    columns,
    listSummary,
    listSearch,
    className = '',
    commonActions,
    ...otherPops
  } = props;
  const rowKey: Key = (props.rowKey || 'id') as any;
  const router = useRouter();
  //-1 表示不允许选，0 表示不限制选
  const {limit: selectLimit = 0, onChange: onSelectedChange, autoSubmit = true} = selection || {};
  const immutable = useRef({
    initializing: true,
    updateSelected(data: {keys: Key[]; rows: Partial<T>[]; maps: {[key: Key]: Partial<T>}}) {
      setSelected(data);
      if (data.keys.length === 0) {
        setReviewMode(false);
      }
      const onSelectedChange = mutable.current.onSelectedChange;
      onSelectedChange && onSelectedChange(data);
    },
    clearSelected() {
      immutable.current.updateSelected({keys: [], rows: [], maps: {}});
    },
    onSelectedSubmit() {
      const selected = mutable.current.selected;
      router.back(1, 'window');
      const {onSelectedSubmit} = (router.location.state || {}) as BaseLocationState;
      onSelectedSubmit && onSelectedSubmit(selected.rows);
    },
  });
  useEffect(() => {
    immutable.current.initializing = false;
  }, []);

  const limit = useMemo(() => {
    const limitArr = typeof selectLimit === 'number' ? [selectLimit] : selectLimit;
    const limitMax = limitArr[1] !== undefined ? limitArr[1] : limitArr[0];
    const limitMin = limitArr[1] !== undefined ? limitArr[0] : 0;
    return {limitMax, limitMin, limitArr};
  }, [selectLimit]);

  const [reviewMode, setReviewMode] = useState((selectedRowKeys || selectedRows || []).length > 0);
  useMemo(() => {
    if (!immutable.current.initializing) {
      setReviewMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  const [selected, setSelected] = useState(computeSelected(rowKey, selectedRowKeys, selectedRows));
  useMemo(() => {
    if (!immutable.current.initializing) {
      const selected = computeSelected(rowKey, selectedRowKeys, selectedRows);
      immutable.current.updateSelected(selected);
    }
  }, [rowKey, selectedRowKeys, selectedRows]);

  const currentData = {onSelectedChange, selected, autoSubmit};
  const mutable = useRef<typeof currentData>({} as any);
  Object.assign(mutable.current, currentData);

  const batchMenu: ReactNode = useMemo(() => {
    if (batchActions) {
      const onClick = ({key}: {key: string}) => {
        const {keys} = mutable.current.selected;
        const {actions, handler} = batchActions;
        const target = actions.find((item) => item.key === key);
        if (target && target.confirm) {
          Modal.confirm({
            icon: <InfoCircleOutlined />,
            content:
              target.confirm === true ? (
                <div className={styles.batchConfirm}>
                  您确认要【<span className="em">{target.label}</span>】所选择的 <a>{keys.length}</a> 项吗？
                  {typeof target.confirm === 'string' ? <div>{target.confirm}</div> : null}
                </div>
              ) : (
                <target.confirm selected={keys.length} />
              ),
            onOk: () => {
              setReviewMode(false);
              handler(target, keys);
            },
          });
        } else {
          handler(target!, keys);
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

  const rowSelection: TableProps<T>['rowSelection'] | undefined = useMemo(() => {
    const limitMax = limit.limitMax;
    if (limitMax > -1) {
      return {
        preserveSelectedRowKeys: true,
        columnWidth: 60,
        type: limitMax === 1 ? 'radio' : 'checkbox',
        selectedRowKeys: selected.keys,
        onChange: (selectedRowKeys, selectedRows) => {
          const rows: T[] = [];
          const maps: {[key: string]: T; [key: number]: T} = {};
          if (limitMax > 0) {
            if (selectedRowKeys.length > limitMax) {
              message.error('剩余可选 0 项！');
              return;
            }
          }
          const keys = selectedRowKeys.map((key, index) => {
            const item = selectedRows[index] || selected.maps[key];
            rows.push(item);
            maps[key] = item;
            return key;
          });
          immutable.current.updateSelected({keys, rows, maps});
          if (limitMax > 0 && selectedRowKeys.length === limitMax && mutable.current.autoSubmit) {
            setTimeout(immutable.current.onSelectedSubmit, 0);
            return;
          }
        },
      };
    } else {
      return undefined;
    }
  }, [limit.limitMax, selected]);

  const {pageCurrent, pageSize, totalItems} = listSummary || {pageCurrent: 1, pageSize: 10, totalItems: 0, totalPages: 0};
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

  const {sorterField, sorterOrder} = listSearch || {};
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

  const headArea = useMemo(() => {
    const {limitMax, limitMin, limitArr} = limit;
    const {keys} = selected;
    if (!commonActions && !batchMenu && limitMax < 0) {
      return;
    }
    return (
      <div className="hd">
        {limitMax > -1 && !batchMenu && (
          <Button
            onClick={immutable.current.onSelectedSubmit}
            disabled={!!limitMin && keys.length < limitMin}
            type="primary"
            icon={<CheckOutlined />}
          >
            提交<span className="tip">{`(可选${limitArr.map((n) => (n === 0 ? '多' : n)).join('-')}项)`}</span>
          </Button>
        )}
        {keys.length === 0 ? commonActions : batchMenu}
        {reviewMode && (
          <Button onClick={() => setReviewMode(false)} type="dashed" icon={<LeftOutlined />}>
            返回列表
          </Button>
        )}
        {keys.length > 0 && (
          <Alert
            message={
              <div>
                <span>已选 </span>
                <a onClick={() => setReviewMode(true)} className="em">
                  {keys.length}
                </a>
                <span> 项，</span>
                {limitMax > 0 && (
                  <>
                    <span>剩余可选 </span>
                    <span className="em">{limitMax - keys.length}</span> 项，
                  </>
                )}
                <a onClick={() => setReviewMode(!reviewMode)}>{reviewMode ? '返回' : '查看'}</a>
                <span> 或 </span>
                <a onClick={immutable.current.clearSelected}>清空选择</a>
              </div>
            }
            type="info"
            showIcon
          />
        )}
      </div>
    );
  }, [batchMenu, commonActions, limit, reviewMode, selected]);

  return (
    <div className={styles.root + ' ' + className}>
      {headArea}
      <Table<T>
        columns={columnList}
        pagination={reviewMode ? false : pagination}
        rowSelection={rowSelection}
        dataSource={reviewMode ? (selected.rows as T[]) : dataSource}
        rowKey={rowKey as any}
        {...otherPops}
      />
    </div>
  );
}

export default memo(Component) as typeof Component;
