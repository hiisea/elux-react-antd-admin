//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import ErrorPage from '@elux-admin-antd/stage/components/ErrorPage';
import {CurUser} from '@elux-admin-antd/stage/entity';
import {Switch, connectStore} from '@elux/react-web';
import {Layout} from 'antd';
import {FC, useMemo} from 'react';
import {APPState, LoadComponent} from '@/Global';
import {SubModule} from '../../entity';
import Flag from '../Flag';
import Header from '../Header';
import Menu from '../Menu';
import Tabs from '../Tabs';
import styles from './index.module.less';

//LoadComponent是懒执行的，不用担心
const SubModuleViews: {[moduleName: string]: () => JSX.Element} = Object.keys(SubModule).reduce((cache, moduleName) => {
  cache[moduleName] = LoadComponent(moduleName as any, 'main');
  return cache;
}, {});

export interface StoreProps {
  curUser: CurUser;
  dialogMode: boolean;
  subModule?: SubModule;
  siderCollapsed?: boolean;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {subModule, dialogMode, siderCollapsed} = appState.admin!;
  return {curUser, subModule, dialogMode, siderCollapsed};
}

const Component: FC<StoreProps> = ({curUser, subModule, dialogMode, siderCollapsed}) => {
  const content = useMemo(
    () => (
      <Switch elseView={<ErrorPage />}>
        {subModule &&
          Object.keys(SubModule).map((moduleName) => {
            if (subModule === moduleName) {
              const SubView = SubModuleViews[subModule];
              return <SubView key={moduleName} />;
            } else {
              return null;
            }
          })}
      </Switch>
    ),
    [subModule]
  );

  if (!curUser.hasLogin) {
    return null;
  }
  if (dialogMode) {
    return content;
  }
  return (
    <div className={styles.root}>
      <Layout>
        <Layout.Sider className="g-scrollBar" trigger={null} collapsible collapsed={siderCollapsed}>
          <Flag />
          <Menu />
        </Layout.Sider>
        <Layout>
          <Layout.Header>
            <Header />
            <Tabs />
          </Layout.Header>
          <Layout.Content>{content}</Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
};

//connectRedux中包含了exportView()的执行
export default connectStore(mapStateToProps)(Component);
