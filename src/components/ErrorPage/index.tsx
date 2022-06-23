import {FC, memo, useCallback} from 'react';
import {useRouter} from '@/Global';
import styles from './index.module.less';

export interface Props {
  message?: string;
}

const Component: FC<Props> = ({message = '(404) Not Found!'}) => {
  const router = useRouter();
  const onBack = useCallback(() => router.back(1), [router]);
  return (
    <div className={styles.root}>
      <div className="message">{message}</div>
      <div className="back" onClick={onBack}>
        返回
      </div>
    </div>
  );
};

export default memo(Component);
