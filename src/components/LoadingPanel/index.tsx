import {LoadingState} from '@elux/react-web';
import {FC, memo} from 'react';
import styles from './index.module.less';

interface Props {
  loadingState?: LoadingState;
}

const Component: FC<Props> = ({loadingState}) => {
  return (
    <div className={`${styles.root} ${loadingState?.toLowerCase()}`}>
      <div className="loading-icon" />
    </div>
  );
};

export default memo(Component);
