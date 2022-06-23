import {FC, memo, useCallback} from 'react';
import {useRouter} from '@/Global';
import styles from './index.module.less';

interface Props {
  title: string;
  onBack?: Boolean | (() => void);
}

const Component: FC<Props> = ({title, onBack}) => {
  const router = useRouter();
  const onClick = useCallback(() => {
    if (typeof onBack === 'function') {
      onBack();
    } else if (onBack === true) {
      router.back(1, 'window');
    }
  }, [onBack, router]);

  return (
    <div className={styles.root}>
      {onBack && <div className="back" onClick={onClick} />}
      <div className="title">{title}</div>
    </div>
  );
};

export default memo(Component);
