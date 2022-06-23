import {Switch, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import ErrorPage from '@/components/ErrorPage';
import {APPState} from '@/Global';
import {CurView} from '../entity';
import List from './List';

export interface StoreProps {
  curView?: CurView;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.shop!.curView};
}

const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'list' && <List />}</Switch>;
};

export default connectRedux(mapStateToProps)(Component);
