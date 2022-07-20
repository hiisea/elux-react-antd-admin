import '../assets/css/var.less';
import '../assets/css/global.module.less';
import 'antd/dist/antd.less';
import {DocumentHead, LoadingState, Switch, connectStore} from '@elux/react-web';
import {ConfigProvider} from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import {FC} from 'react';
import {APPState, LoadComponent} from '@/Global';
import ErrorPage from '../components/ErrorPage';
import LoadingPanel from '../components/LoadingPanel';
import {CurView, SubModule} from '../entity';
import Agreement from './Agreement';
import ForgotPassword from './ForgotPassword';
import LoginForm from './LoginForm';
import RegistryForm from './RegistryForm';

const Admin = LoadComponent('admin', 'main');

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
        {subModule === 'admin' && <Admin />}
        {curView === 'login' && <LoginForm />}
        {curView === 'registry' && <RegistryForm />}
        {curView === 'agreement' && <Agreement />}
        {curView === 'forgetPassword' && <ForgotPassword />}
      </Switch>
      <LoadingPanel loadingState={globalLoading} />
    </ConfigProvider>
  );
};

//connectRedux中包含了exportView()的执行
export default connectStore(mapStateToProps)(Component);
