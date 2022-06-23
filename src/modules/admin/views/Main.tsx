//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import {Switch, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import ErrorPage from '@/components/ErrorPage';
import {APPState, LoadComponent} from '@/Global';
import {CurUser} from '@/modules/stage/entity';
import Forbidden from '../components/Forbidden';
import {SubModule} from '../entity';
import Layout from './Layout';

//采用LoadComponent来加载视图，可以懒执行，并自动初始化与之对应的model
const My = LoadComponent('my', 'main');
const Article = LoadComponent('article', 'main');

export interface StoreProps {
  curUser: CurUser;
  subModule?: SubModule;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {subModule} = appState.admin!;
  return {curUser, subModule};
}

const Component: FC<StoreProps> = ({curUser, subModule}) => {
  return curUser.hasLogin ? (
    <Layout>
      <Switch elseView={<ErrorPage />}>
        {subModule === 'article' && <Article />}
        {subModule === 'my' && <My />}
      </Switch>
    </Layout>
  ) : (
    <Forbidden />
  );
};

//connectRedux中包含了exportView()的执行
export default connectRedux(mapStateToProps)(Component);
