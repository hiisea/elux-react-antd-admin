import ErrorPage from '@elux-admin-antd/stage/components/ErrorPage';
import {Dispatch, Switch, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurView, ItemDetail} from '../entity';
import Detail from './Detail';
import Edit from './Edit';
import List from './List';

export interface StoreProps {
  curView?: CurView;
  itemDetail?: ItemDetail;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curView, itemDetail} = appState.member!;
  return {curView, itemDetail};
}

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({curView, itemDetail, dispatch}) => {
  return (
    <Switch elseView={<ErrorPage />}>
      {curView === 'list' && <List />}
      {curView === 'detail' && <Detail itemDetail={itemDetail} />}
      {curView === 'edit' && <Edit itemDetail={itemDetail} />}
    </Switch>
  );
};

export default connectRedux(mapStateToProps)(Component);
