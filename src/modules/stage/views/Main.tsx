import 'antd/dist/antd.less';
import '@/assets/css/global.module.less';
import {DocumentHead, LoadingState, Switch, connectRedux} from '@elux/react-web';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import {FC} from 'react';
import ErrorPage from '@/components/ErrorPage';
import LoadingPanel from '@/components/LoadingPanel';
import {APPState, LoadComponent} from '@/Global';
import {CurView, SubModule} from '../entity';
import Agreement from './Agreement';
import ForgotPassword from './ForgotPassword';
import LoginForm from './LoginForm';
import RegistryForm from './RegistryForm';

//LoadComponent是懒执行的，不用担心
const SubModuleViews: {[moduleName: string]: () => JSX.Element} = Object.keys(SubModule).reduce((cache, moduleName) => {
  cache[moduleName] = LoadComponent(moduleName as any, 'main');
  return cache;
}, {});

export interface StoreProps {
  subModule?: SubModule;
  curView?: CurView;
  globalLoading?: LoadingState;
  error?: string;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {subModule, curView, globalLoading, error} = appState.stage!;
  return {
    subModule,
    curView,
    globalLoading,
    error,
  };
}

const Component: FC<StoreProps> = ({subModule, curView, globalLoading, error}) => {
  return (
    <ConfigProvider locale={zhCN}>
      <DocumentHead title="EluxDemo" />
      <Switch elseView={<ErrorPage />}>
        {!!error && <ErrorPage message={error} />}
        {subModule &&
          Object.keys(SubModule).map((moduleName) => {
            if (subModule === moduleName) {
              const SubView = SubModuleViews[subModule];
              return <SubView key={moduleName} />;
            } else {
              return null;
            }
          })}
        {curView === 'login' && <LoginForm />}
        {curView === 'registry' && <RegistryForm />}
        {curView === 'agreement' && <Agreement />}
        {curView === 'forgetPassword' && <ForgotPassword />}
      </Switch>
      {subModule !== 'admin' && <LoadingPanel loadingState={globalLoading} />}
    </ConfigProvider>
  );
};

//connectRedux中包含了exportView()的执行
export default connectRedux(mapStateToProps)(Component);
