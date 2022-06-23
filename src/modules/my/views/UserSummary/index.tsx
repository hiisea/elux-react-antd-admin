import {DocumentHead, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import {APPState, StaticPrefix} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import styles from './index.module.less';

interface StoreProps {
  curUser: CurUser;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curUser: appState.stage!.curUser};
}

const Component: FC<StoreProps> = ({curUser}) => {
  return (
    <div className={`${styles.root} g-page-content`}>
      <DocumentHead title="个人中心" />
      <h2>个人中心</h2>
      <ul className="g-form">
        <li className="item">
          <label className="item">头像</label>
          <div className="item">
            <div className="avatar" style={{backgroundImage: `url(${StaticPrefix + curUser.avatar})`}} />
          </div>
        </li>
        <li className="item">
          <label className="item">昵称</label>
          <div className="item">
            <input disabled name="username" className="g-input" type="text" value={curUser.username} />
          </div>
        </li>
        <li className="item">
          <label className="item">电话</label>
          <div className="item">
            <input disabled name="mobile" className="g-input" type="text" value={curUser.mobile} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default connectRedux(mapStateToProps)(Component);
