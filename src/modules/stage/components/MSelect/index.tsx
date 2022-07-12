import {CloseCircleFilled, CloseOutlined, FullscreenOutlined} from '@ant-design/icons';
import {memo, useCallback, useMemo, useRef} from 'react';
import {useRouter} from '@/Global';
import {BaseLocationState} from '../../utils/base';
import {DialogPageClassname} from '../../utils/const';
import styles from './index.module.less';

interface Props<T> {
  selectorPathname: string;
  showSearch?: boolean;
  fixedSearch?: Partial<T>;
  className?: string;
  limit?: number | [number, number];
  placeholder?: string;
  rowKey?: string;
  rowName?: string;
  value?: string | string[];
  onChange?: (value?: string | string[]) => void;
}

function Component<TSearch>({
  selectorPathname,
  showSearch,
  fixedSearch,
  className = '',
  limit,
  placeholder,
  rowKey = 'id',
  rowName = 'name',
  value,
  onChange,
}: Props<TSearch>) {
  const selectedRows = useMemo(() => {
    const arr = value ? (typeof value === 'string' ? [value] : value) : [];
    return arr.map((item) => {
      const [id, ...others] = item.split(',');
      const name = others.join(',');
      return {[rowKey]: id, [rowName]: name || id};
    });
  }, [rowKey, rowName, value]);

  const removeItem = useCallback((index: number) => {
    const {selectedRows, rowKey, rowName, onChange} = refData.current;
    const rows = selectedRows
      .slice(0, index)
      .concat(selectedRows.slice(index + 1))
      .map((row) => [row[rowKey], row[rowName]].join(','));
    onChange && onChange(rows.length === 1 ? rows[0] : rows);
  }, []);

  const onSelectedSubmit = useCallback((rows: Record<string, any>[]) => {
    const {rowKey, rowName, onChange} = refData.current;
    const selectedItems = rows.map((item) => [item[rowKey], item[rowName]].filter(Boolean).join(','));
    onChange && onChange(selectedItems);
  }, []);

  const removeAll = useCallback(() => {
    const {onChange} = refData.current;
    onChange && onChange();
  }, []);

  const router = useRouter();

  const refSource = {
    selectedRows,
    rowKey,
    rowName,
    limit,
    showSearch,
    fixedSearch,
    router,
    selectorPathname,
    onSelectedSubmit,
    onChange,
    removeAll,
    removeItem,
  };
  const refData = useRef(refSource);
  Object.assign(refData.current, refSource);

  const onSelect = useCallback(() => {
    const {limit, router, selectorPathname, showSearch, fixedSearch, selectedRows, onSelectedSubmit} = refData.current;
    const state: BaseLocationState = {selectLimit: limit, selectedRows, showSearch, fixedSearch, onSelectedSubmit};
    router.push({pathname: selectorPathname, searchQuery: fixedSearch, classname: DialogPageClassname, state}, 'window');
  }, []);

  const children = useMemo(() => {
    const {removeAll, removeItem, rowKey, rowName} = refData.current;

    return (
      <>
        <div className="ant-select-selector" onClick={onSelect}>
          <div className="ant-select-selection-overflow">
            {selectedRows.map((row, index) => (
              <div key={row[rowKey]} className="ant-select-selection-overflow-item">
                <span className="ant-select-selection-item" title={row[rowName]}>
                  <span className="ant-select-selection-item-content">{row[rowName]}</span>
                  <span
                    className="ant-select-selection-item-remove icon-button"
                    unselectable="on"
                    aria-hidden="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(index);
                    }}
                  >
                    <CloseOutlined />
                  </span>
                </span>
              </div>
            ))}
          </div>
          {placeholder && selectedRows.length < 1 && <span className="ant-select-selection-placeholder">{placeholder}</span>}
        </div>
        <span className="ant-select-arrow icon-button" unselectable="on" aria-hidden="true" onClick={onSelect}>
          <FullscreenOutlined />
        </span>
        {selectedRows.length > 0 && (
          <span className="ant-select-clear icon-button" unselectable="on" aria-hidden="true" onClick={removeAll}>
            <CloseCircleFilled />
          </span>
        )}
      </>
    );
  }, [selectedRows, onSelect, placeholder]);

  return <div className={`${styles.root} ${className} ant-select ant-select-multiple ant-select-show-search ant-select-allow-clear`}>{children}</div>;
}

export default memo(Component) as typeof Component;
