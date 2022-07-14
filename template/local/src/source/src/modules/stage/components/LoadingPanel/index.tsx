import {LoadingState} from '@elux/react-web';
import {Spin} from 'antd';
import {FC, memo} from 'react';
import styles from './index.module.less';

interface Props {
  className?: string;
  loadingState?: LoadingState;
}

const Component: FC<Props> = ({loadingState, className = ''}) => {
  return (
    <div className={`${styles.root} ${loadingState?.toLowerCase()} ${className}`}>
      <div className="loading-icon">
        <Spin size="large" />
      </div>
    </div>
  );
};

export default memo(Component);
