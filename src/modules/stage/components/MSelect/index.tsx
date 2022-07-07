import {CloseCircleFilled, CloseOutlined, FullscreenOutlined} from '@ant-design/icons';
import {memo, useCallback, useMemo, useRef} from 'react';
import {GetClientRouter} from '@/Global';
import styles from './index.module.less';

interface Props {
  source: string;
  className?: string;
  limit?: number | [number, number];
  allowClear?: boolean;
  placeholder?: string;
  value?: string | string[];
  onChange?: (value?: string | string[]) => void;
}

function Component({className = '', source, value, placeholder, onChange}: Props) {
  const datasource = useMemo(() => {
    const arr = value ? (typeof value === 'string' ? [value] : value) : [];
    return arr.map((item) => {
      const [id, ...others] = item.split(',');
      const name = others.join(',');
      return {id, name: name || id};
    });
  }, [value]);

  const refSource = {datasource, onChange, source};
  const refData = useRef(refSource);
  Object.assign(refData.current, refSource);

  const removeItem = useCallback((index: number) => {
    const {datasource, onChange} = refData.current;
    const newDatasource = datasource
      .slice(0, index)
      .concat(datasource.slice(index + 1))
      .map(({id, name}) => [id, name].join(','));
    onChange && onChange(newDatasource.length === 1 ? newDatasource[0] : newDatasource);
  }, []);

  const removeAll = useCallback(() => {
    const {onChange} = refData.current;
    onChange && onChange();
  }, []);

  const onSelect = useCallback(() => {
    GetClientRouter().push({url: refData.current.source, classname: '_dialog'}, 'window');
  }, []);

  const children = useMemo(() => {
    return (
      <>
        <div className="ant-select-selector" onClick={onSelect}>
          <div className="ant-select-selection-overflow">
            {datasource.map(({id, name}, index) => (
              <div key={id} className="ant-select-selection-overflow-item">
                <span className="ant-select-selection-item" title={name}>
                  <span className="ant-select-selection-item-content">{name}</span>
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
          {placeholder && datasource.length < 1 && <span className="ant-select-selection-placeholder">{placeholder}</span>}
        </div>
        <span className="ant-select-arrow icon-button" unselectable="on" aria-hidden="true" onClick={onSelect}>
          <FullscreenOutlined />
        </span>
        {datasource.length > 0 && (
          <span className="ant-select-clear icon-button" unselectable="on" aria-hidden="true" onClick={removeAll}>
            <CloseCircleFilled />
          </span>
        )}
      </>
    );
  }, [datasource, onSelect, placeholder, removeAll, removeItem]);

  return <div className={`${styles.root} ${className} ant-select ant-select-multiple ant-select-show-search ant-select-allow-clear`}>{children}</div>;
}

export default memo(Component) as typeof Component;
