import {Dispatch, DocumentHead, Link, connectRedux} from '@elux/react-web';
import {FC, useCallback} from 'react';
import {APPState, Modules, useRouter} from '@/Global';
import {excludeDefaultParams} from '@/utils/tools';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import {ListItem, ListSearch, ListSummary, defaultListSearch} from '../../entity';
import styles from './index.module.less';

interface StoreProps {
  prefixPathname: string;
  listSearch: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {prefixPathname, listSearch, list, listSummary} = appState.article!;
  return {prefixPathname, listSearch, list, listSummary};
}

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({prefixPathname, listSearch, list, listSummary, dispatch}) => {
  const router = useRouter();
  const onPageChange = useCallback(
    (pageCurrent: number) => {
      router.push({
        pathname: `${prefixPathname}/list`,
        searchQuery: excludeDefaultParams(defaultListSearch, {keyword: listSearch.keyword, pageCurrent}),
      });
    },
    [router, prefixPathname, listSearch?.keyword]
  );
  const onSearch = useCallback(
    (keyword: string) => {
      router.push({pathname: `${prefixPathname}/list`, searchQuery: excludeDefaultParams(defaultListSearch, {keyword})});
    },
    [router, prefixPathname]
  );
  const onDeleteItem = useCallback(
    (id) => {
      dispatch(Modules.article.actions.deleteItem(id));
    },
    [dispatch]
  );
  const onEditItem = useCallback(
    (id = '0') => {
      router.push({url: `${prefixPathname}/edit?id=${id}`, classname: '_dialog'}, 'window');
    },
    [router, prefixPathname]
  );

  return (
    <div className={`${styles.root} g-page-content`}>
      <DocumentHead title="文章列表" />
      <h2>文章管理</h2>
      <SearchBar keyword={listSearch.keyword} onSubmit={onSearch} onCreate={onEditItem} />
      {list && listSummary && (
        <>
          <table className="list">
            <colgroup>
              <col width="100px" />
              <col width="30%" />
              <col />
              <col width="150px" />
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>文章标题</th>
                <th>摘要</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
                  <td className="item-id">{item.id}</td>
                  <td className="item-title">
                    <Link to={`${prefixPathname}/detail?id=${item.id}`} target="window">
                      {item.title}
                    </Link>
                  </td>
                  <td className="item-summary">{item.summary}</td>
                  <td className="item-action">
                    <Link to={`${prefixPathname}/detail?id=${item.id}`} target="window">
                      查看
                    </Link>
                    <Link to={`${prefixPathname}/edit?id=${item.id}&__c=_dialog`} target="window">
                      修改
                    </Link>
                    <a className="item" onClick={() => onDeleteItem(item.id)}>
                      删除
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <Pagination totalPages={listSummary.totalPages} pageCurrent={listSummary.pageCurrent} onChange={onPageChange} />
          </div>
          <Link className="g-ad" to="/shop/list" action="push" target="window">
            -- 特惠商城，盛大开业 --
          </Link>
        </>
      )}
    </div>
  );
};

export default connectRedux(mapStateToProps)(Component);
