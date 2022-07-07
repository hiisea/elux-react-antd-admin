import {DocumentHead} from '@elux/react-web';
import {FC, memo} from 'react';
import ListTable from './ListTable';
import SearchForm from './SearchForm';

const Component: FC = () => {
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

export default memo(Component);
