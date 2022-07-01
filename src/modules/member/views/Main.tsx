import ErrorPage from '@elux-admin-antd/stage/components/ErrorPage';
import {Switch, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurView, ItemDetail} from '../entity';
import Detail from './Detail';
import List from './List';

export interface StoreProps {
  curView?: CurView;
  itemDetail?: ItemDetail;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curView, itemDetail} = appState.member!;
  return {curView, itemDetail};
}

const Component: FC<StoreProps> = ({curView, itemDetail}) => {
  return (
    <Switch elseView={<ErrorPage />}>
      {curView === 'list' && <List />}
      {curView === 'detail' && <Detail itemDetail={itemDetail} />}
    </Switch>
  );
};

export default connectRedux(mapStateToProps)(Component);
