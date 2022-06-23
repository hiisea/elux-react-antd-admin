import {DocumentHead, Link, exportView} from '@elux/react-web';
import {FC, memo} from 'react';
import {ItemDetail} from '../../entity';
import styles from './index.module.less';

interface Props {
  itemDetail?: ItemDetail;
}

const Component: FC<Props> = ({itemDetail}) => {
  return (
    <div className={`${styles.root} g-page-content`}>
      <DocumentHead title={itemDetail?.title || '......'} />
      <h2>文章管理</h2>
      <div className="hd">
        <Link className="back" to={1} action="back" target="window"></Link>
        <div className="title">{itemDetail?.title || '......'}</div>
        <div className="summary">{itemDetail?.summary || '......'}</div>
      </div>
      <div className="bd">{itemDetail?.content || ''}</div>
    </div>
  );
};

export default exportView(memo(Component));
