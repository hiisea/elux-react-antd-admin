import {DocumentHead, exportView} from '@elux/react-web';
import {FC, memo} from 'react';
import styles from './index.module.less';

const Component: FC = () => {
  return (
    <div className={styles.root}>
      <DocumentHead title="我的工作台" />
      <div>sfsdfsd</div>
    </div>
  );
};

export default exportView(memo(Component));
