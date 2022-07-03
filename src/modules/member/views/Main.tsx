import ErrorPage from '@elux-admin-antd/stage/components/ErrorPage';
import {Dispatch, Switch, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import {APPState} from '@/Global';
import {CurView, ItemDetail} from '../entity';
import Detail from './Detail';
import Edit from './Edit';
import List from './List';

export interface StoreProps {
  prefixPathname: string;
  curView?: CurView;
  itemDetail?: ItemDetail;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curView, itemDetail, prefixPathname} = appState.member!;
  return {curView, itemDetail, prefixPathname};
}

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({prefixPathname, curView, itemDetail, dispatch}) => {
  return (
    <Switch elseView={<ErrorPage />}>
      {curView === 'list' && <List />}
      {curView === 'detail' && <Detail itemDetail={itemDetail} listUrl={`${prefixPathname}/list`} />}
      {curView === 'edit' && <Edit itemDetail={itemDetail} listUrl={`${prefixPathname}/list`} dispatch={dispatch} />}
    </Switch>
  );
};

export default connectRedux(mapStateToProps)(Component);
