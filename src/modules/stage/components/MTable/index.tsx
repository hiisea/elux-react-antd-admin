import {AlignLeftOutlined, CheckOutlined, DownOutlined, InfoCircleOutlined, LeftOutlined} from '@ant-design/icons';
import {Alert, Button, Dropdown, Menu, Modal, Table, message} from 'antd';
import {ColumnProps, TableProps} from 'antd/lib/table';
import {ComponentType, Key, ReactNode, memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from '@/Global';
import DateTime from '../../components/DateTime';
import {BaseListSearch, BaseListSummary, BaseLocationState} from '../../utils/resource';
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
  onChange?: (keys: Key[], rows: Partial<T>[], maps: {[key: Key]: Partial<T>}) => void;
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
  //-1 表示不允许选，0 表示不限制选
  const {limit: selectLimit = 0, onChange: onSelectedChange, autoSubmit = true} = selection || {};
  const router = useRouter();
  const refData = useRef<typeof refSource>({} as any);
  const [selected, setSelected] = useState<{keys: Key[]; rows: Partial<T>[]; maps: {[key: Key]: Partial<T>}}>({
    keys: [],
    rows: [],
    maps: {},
  });

  const updateSelected = useCallback((keys: Key[], rows: Partial<T>[], maps: {[key: Key]: Partial<T>}) => {
    setSelected({keys, rows, maps});
    if (keys.length === 0) {
      setReviewMode(false);
    }
    const onSelectedChange = refData.current.onSelectedChange;
    onSelectedChange && onSelectedChange(keys, rows, maps);
  }, []);

  const clearSelected = useCallback((): void => refData.current.updateSelected([], [], {}), []);

  const returnTotal = useCallback((total: number) => {
    return `共${total}条`;
  }, []);

  const onSelectedSubmit = useCallback(() => {
    const {router, selected} = refData.current;
    router.back(1, 'window');
    const {onSelectedSubmit} = (router.location.state || {}) as BaseLocationState;
    onSelectedSubmit && onSelectedSubmit(selected.rows);
  }, []);

  const refSource = {
    router,
    selectLimit: typeof selectLimit === 'number' ? [selectLimit] : selectLimit,
    selected,
    autoSubmit,
    onSelectedSubmit,
    onSelectedChange,
    updateSelected,
    clearSelected,
    returnTotal,
  };
  const limitMax = refSource.selectLimit[1] !== undefined ? refSource.selectLimit[1] : refSource.selectLimit[0];
  const limitMin = refSource.selectLimit[1] !== undefined ? refSource.selectLimit[0] : 0;
  Object.assign(refData.current, refSource);

  const [reviewMode, setReviewMode] = useState((props.selectedRowKeys || props.selectedRows || []).length > 0);

  useMemo(() => {
    const keys = props.selectedRowKeys || (props.selectedRows || []).map((item) => item[rowKey as string] as Key);
    const rows = props.selectedRows || (props.selectedRowKeys || []).map((key) => ({[rowKey as string]: key} as Partial<T>));
    const maps = rows.reduce((data, cur) => {
      data[cur[rowKey as string] as Key] = cur;
      return data;
    }, {} as {[key: Key]: Partial<T>});
    refData.current.updateSelected(keys, rows, maps);
  }, [props.selectedRowKeys, props.selectedRows, rowKey]);

  const batchMenu: ReactNode = useMemo(() => {
    if (batchActions) {
      const onClick = ({key}: {key: string}) => {
        const {keys} = refData.current.selected;
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

  useEffect(() => {
    setReviewMode(false);
  }, [dataSource]);

  const rowSelection: TableProps<T>['rowSelection'] | undefined = useMemo(() => {
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
          refData.current.updateSelected(keys, rows, maps);
          if (limitMax > 0 && selectedRowKeys.length === limitMax && refData.current.autoSubmit) {
            setTimeout(refData.current.onSelectedSubmit, 0);
            return;
          }
        },
      };
    } else {
      return undefined;
    }
  }, [limitMax, selected]);

  const pagination = useMemo(
    () => ({
      showTotal: refData.current.returnTotal,
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

  const headArea = useMemo(() => {
    if (!commonActions && !batchMenu && limitMax < 0) {
      return;
    }
    return (
      <div className="hd">
        {limitMax > -1 && !batchMenu && (
          <Button
            onClick={refData.current.onSelectedSubmit}
            disabled={!!limitMin && selected.keys.length < limitMin}
            type="primary"
            icon={<CheckOutlined />}
          >
            提交<span className="tip">{`(可选${refData.current.selectLimit.map((n) => (n === 0 ? '多' : n)).join('-')}项)`}</span>
          </Button>
        )}
        {selected.keys.length === 0 ? commonActions : batchMenu}
        {reviewMode && (
          <Button onClick={() => setReviewMode(false)} type="dashed" icon={<LeftOutlined />}>
            返回列表
          </Button>
        )}
        {selected.keys.length > 0 && (
          <Alert
            message={
              <div>
                <span>已选 </span>
                <a onClick={() => setReviewMode(true)} className="em">
                  {selected.keys.length}
                </a>
                <span> 项，</span>
                {limitMax > 0 && (
                  <>
                    <span>剩余可选 </span>
                    <span className="em">{limitMax - selected.keys.length}</span> 项，
                  </>
                )}
                <a onClick={() => setReviewMode(!reviewMode)}>{reviewMode ? '返回' : '查看'}</a>
                <span> 或 </span>
                <a onClick={refData.current.clearSelected}>清空选择</a>
              </div>
            }
            type="info"
            showIcon
          />
        )}
      </div>
    );
  }, [batchMenu, commonActions, limitMax, limitMin, reviewMode, selected]);

  return (
    <div className={styles.root + ' ' + className}>
      {headArea}
      <Table<T>
        columns={columnList}
        pagination={reviewMode ? false : pagination}
        rowSelection={rowSelection}
        dataSource={reviewMode ? (selected.rows as T[]) : dataSource}
        rowKey={rowKey}
        {...otherPops}
      />
    </div>
  );
}

export default memo(Component) as typeof Component;
