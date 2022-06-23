//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import {Switch, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import ErrorPage from '@/components/ErrorPage';
import {APPState} from '@/Global';
import {CurView} from '../entity';
import UserSummary from './UserSummary';

export interface StoreProps {
  curView?: CurView;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.my!.curView};
}

const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'userSummary' && <UserSummary />}</Switch>;
};

export default connectRedux(mapStateToProps)(Component);
