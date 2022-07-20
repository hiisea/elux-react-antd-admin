import ErrorPage from '@elux-admin-antd/stage/components/ErrorPage';
import {Dispatch, Switch, connectStore} from '@elux/react-web';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurRender, CurView, ItemDetail} from '../entity';
import Detail from './Detail';
import Edit from './Edit';
import Maintain from './Maintain';
import Selector from './Selector';

export interface StoreProps {
  curView?: CurView;
  curRender?: CurRender;
  itemDetail?: ItemDetail;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curView, curRender, itemDetail} = appState.member!;
  return {curView, curRender, itemDetail};
}
//
const Component: FC<StoreProps & {dispatch: Dispatch}> = ({curView, curRender, itemDetail, dispatch}) => {
  return (
    <Switch elseView={<ErrorPage />}>
      {curView === 'list' && curRender === 'maintain' && <Maintain />}
      {curView === 'list' && curRender === 'selector' && <Selector />}
      {curView === 'item' && curRender === 'detail' && <Detail itemDetail={itemDetail} />}
      {curView === 'item' && curRender === 'edit' && <Edit itemDetail={itemDetail} dispatch={dispatch} />}
    </Switch>
  );
};

export default connectStore(mapStateToProps)(Component);
