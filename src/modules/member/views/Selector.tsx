import DialogPage from '@elux-admin-antd/stage/components/DialogPage';
import {connectRedux} from '@elux/react-web';
import {FC, useMemo} from 'react';
import {APPState} from '@/Global';
import ListTable from './ListTable';
import SearchForm from './SearchForm';

interface StoreProps {
  listConfig?: {selectLimit?: number | [number, number]; showSearch?: {[key: string]: any}};
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {listConfig} = state.member!;
  return {listConfig};
};

const Component: FC<StoreProps> = ({listConfig}) => {
  const selection = useMemo(() => {
    return {limit: listConfig?.selectLimit};
  }, [listConfig?.selectLimit]);

  return (
    <DialogPage subject="用户列表" mask>
      <div className="g-dialog-content" style={{width: 1100, height: 750}}>
        <SearchForm />
        <ListTable size="middle" selection={selection} />
      </div>
    </DialogPage>
  );
};

export default connectRedux(mapStateToProps)(Component);
