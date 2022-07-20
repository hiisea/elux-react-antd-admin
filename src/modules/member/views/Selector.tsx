import DialogPage from '@elux-admin-antd/stage/components/DialogPage';
import {MColumns} from '@elux-admin-antd/stage/components/MTable';
import {connectStore} from '@elux/react-web';
import {FC, useMemo} from 'react';
import {APPState, useRouter} from '@/Global';
import {ListItem, ListSearch, LocationState} from '../entity';
import ListTable from './ListTable';
import SearchForm from './SearchForm';

interface StoreProps {
  prefixPathname: string;
  listSearch: ListSearch;
  curRender?: string;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, curRender, listSearch} = state.member!;
  return {prefixPathname, curRender, listSearch};
};

const mergeColumns: {[field: string]: MColumns<ListItem>} = {
  articles: {disable: true},
};

const Component: FC<StoreProps> = ({prefixPathname, curRender, listSearch}) => {
  const router = useRouter();
  const {selectLimit, showSearch, fixedSearch, selectedRows} = (router.location.state || {}) as LocationState;

  const selection = useMemo(() => {
    return {limit: selectLimit};
  }, [selectLimit]);

  return (
    <DialogPage subject="用户列表" mask>
      <div className="g-dialog-content" style={{width: 1100, height: 750}}>
        {showSearch && <SearchForm listSearch={listSearch} fixedFields={fixedSearch} listPathname={`${prefixPathname}/list/${curRender}`} />}
        <ListTable
          selectedRows={selectedRows}
          mergeColumns={mergeColumns}
          selection={selection}
          listPathname={`${prefixPathname}/list/${curRender}`}
        />
      </div>
    </DialogPage>
  );
};

export default connectStore(mapStateToProps)(Component);
