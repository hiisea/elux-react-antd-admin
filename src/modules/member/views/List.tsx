import {Dispatch, DocumentHead, connectRedux} from '@elux/react-web';
import {FC} from 'react';
import {APPState} from '@/Global';
import ListTable from './ListTable';
import SearchForm from './SearchForm';

interface StoreProps {
  prefixPathname: string;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname} = state.member!;
  return {prefixPathname};
};

const Component: FC<StoreProps & {dispatch: Dispatch}> = (props) => {
  return (
    <div className="g-page-content">
      <DocumentHead title="用户列表" />
      <div>
        <SearchForm />
        <ListTable />
      </div>
    </div>
  );
};

export default connectRedux(mapStateToProps)(Component);
