import {FC, memo} from 'react';
import styles from './index.module.less';

const Component: FC = () => {
  return (
    <div className={styles.root}>
      <div className="title">
        Elux后台管理系统<span className="ver">v1.2</span>
      </div>
    </div>
  );
};

export default memo(Component);
