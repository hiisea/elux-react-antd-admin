import {Dispatch, DocumentHead, Link, connectRedux} from '@elux/react-web';
import {FC, useCallback, useState} from 'react';
import {GetActions} from '@/Global';
import styles from './index.module.less';

const {stage: stageActions} = GetActions('stage');

const Component: FC<{dispatch: Dispatch}> = ({dispatch}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const onSubmit = useCallback(() => {
    if (!username || !password) {
      setErrorMessage('请输入用户名、密码');
    } else {
      //这样的写法可以使用TS的类型提示，等同于dispatch({type:'stage.login',payload:{username, password}})
      //可以await这个action的所有handler执行完成
      const result = dispatch(stageActions.login({username, password})) as Promise<void>;
      result.catch(({message}) => {
        setErrorMessage(message);
      });
    }
  }, [dispatch, password, username]);
  const onCancel = useCallback(() => {
    dispatch(stageActions.cancelLogin());
  }, [dispatch]);

  return (
    <div className="wrap">
      <div className={`${styles.root} g-page-dialog`}>
        <DocumentHead title="登录" />
        <h2>请登录</h2>
        <div className="g-form">
          <div className="item">
            <div className="item">用户名</div>
            <div className="item">
              <input
                name="username"
                type="text"
                className="g-input"
                placeholder="请输入"
                onChange={(e) => setUsername(e.target.value.trim())}
                value={username}
              />
            </div>
          </div>
          <div className="item item-last">
            <div className="item">密码</div>
            <div className="item">
              <input
                name="password"
                type="text"
                className="g-input"
                placeholder="请输入"
                onChange={(e) => setPassword(e.target.value.trim())}
                value={password}
              />
            </div>
          </div>
          <div className="item item-error">
            <div className="item"></div>
            <div className="item">{errorMessage}</div>
          </div>
        </div>
        <div className="g-control">
          <button type="submit" className="g-button primary" onClick={onSubmit}>
            登 录
          </button>
          <button type="button" className="g-button" onClick={onCancel}>
            取 消
          </button>
        </div>
        <Link className="g-ad" to="/shop/list" action="push" target="window">
          -- 特惠商城，盛大开业 --
        </Link>
      </div>
    </div>
  );
};

//connectRedux中包含了exportView()的执行
export default connectRedux()(Component);
