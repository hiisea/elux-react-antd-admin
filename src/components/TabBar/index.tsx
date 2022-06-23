import {Link} from '@elux/react-web';
import {FC, memo} from 'react';
import styles from './index.module.less';

interface Props {
  selected: 'article' | 'my';
}

const Component: FC<Props> = ({selected}) => {
  return (
    <div className={styles.root}>
      <Link to="/article/list" action="relaunch" target="window" className={`item ${selected === 'article' ? 'on' : ''}`}>
        文章
      </Link>
      <Link to="/admin/my/userSummary" action="relaunch" target="window" className={`item ${selected === 'my' ? 'on' : ''}`}>
        我的
      </Link>
    </div>
  );
};

export default memo(Component);
