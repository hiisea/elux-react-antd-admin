import ErrorPage from '@elux-admin-antd/stage/components/ErrorPage';
import {Switch, connectStore} from '@elux/react-web';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurView} from '../entity';
import Workplace from './Workplace';

export interface StoreProps {
  curView?: CurView;
}

function mapStateToProps(appState: APPState): StoreProps {
  return {curView: appState.dashboard!.curView};
}

const Component: FC<StoreProps> = ({curView}) => {
  return <Switch elseView={<ErrorPage />}>{curView === 'workplace' && <Workplace />}</Switch>;
};

export default connectStore(mapStateToProps)(Component);
