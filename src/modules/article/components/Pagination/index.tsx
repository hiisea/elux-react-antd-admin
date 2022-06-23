import {FC, memo, useMemo} from 'react';
import styles from './index.module.less';

interface Props {
  totalPages: number;
  pageCurrent: number;
  onChange: (page: number) => void;
}

const Component: FC<Props> = ({totalPages, pageCurrent, onChange}) => {
  const pages = useMemo(() => {
    const min = Math.max(1, pageCurrent - 3);
    const max = Math.min(totalPages, pageCurrent + 3);
    const arr: number[] = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }, [pageCurrent, totalPages]);
  return (
    <div className={styles.root}>
      <div className="info">{`第 ${pageCurrent} 页 / 共 ${totalPages} 页`}</div>
      <div className="pages">
        {pageCurrent > 1 && <a onClick={() => onChange(pageCurrent - 1)}>&#60;</a>}
        {pages[0] > 1 && <span>...</span>}
        {pages.map((val) => (
          <a key={val} onClick={() => onChange(val)} className={val === pageCurrent ? 'on' : ''}>
            {val}
          </a>
        ))}
        {pages[pages.length - 1] < totalPages && <span>...</span>}
        {pageCurrent < totalPages && <a onClick={() => onChange(pageCurrent + 1)}>&#62;</a>}
      </div>
    </div>
  );
};

export default memo(Component);
