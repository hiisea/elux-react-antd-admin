import {PlusOutlined} from '@ant-design/icons';
import MTable, {MColumns} from '@elux-admin-antd/stage/components/MTable';
import {useAlter, useShowDetail, useTableChange} from '@elux-admin-antd/stage/utils/resource';
import {Dispatch, Link, LoadingState, connectRedux} from '@elux/react-web';
import {Button, Dropdown, Menu, Popconfirm, Tooltip} from 'antd';
import {FC, useMemo} from 'react';
import {APPState, GetActions} from '@/Global';
import {CurRender, DStatus, ListItem, ListSearch, ListSummary, Status, defaultListSearch} from '../entity';

interface StoreProps {
  prefixPathname: string;
  curRender?: CurRender;
  selectedRows?: ListItem[];
  listSearch: ListSearch;
  list?: ListItem[];
  listSummary?: ListSummary;
  listLoading?: LoadingState;
}

const mapStateToProps: (state: APPState) => StoreProps = (state) => {
  const {prefixPathname, listSearch, list, listSummary, listLoading, curRender} = state.article!;
  return {prefixPathname, listSearch, list, listSummary, listLoading, curRender};
};

const {article: articleActions} = GetActions('article');

const Component: FC<StoreProps & {dispatch: Dispatch}> = (props) => {
  const {prefixPathname, listSearch, list, listSummary, listLoading, dispatch, curRender} = props;

  const {selectedRows, deleteItems, alterItems, updateItem} = useAlter(dispatch, articleActions, props.selectedRows);
  const {onShowDetail, onShowEditor} = useShowDetail(prefixPathname);
  const onTableChange = useTableChange(`${prefixPathname}/list/${curRender}`, defaultListSearch, listSearch);

  const commActions = useMemo(
    () =>
      curRender === 'maintain' ? (
        <>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => onShowEditor('', updateItem)}>
            新建
          </Button>
        </>
      ) : undefined,
    [curRender, onShowEditor, updateItem]
  );
  const batchActions = useMemo(
    () =>
      curRender === 'maintain'
        ? {
            actions: [
              {key: 'delete', label: '批量删除', confirm: true},
              {key: 'resolved', label: '批量通过', confirm: true},
              {key: 'rejected', label: '批量拒绝', confirm: true},
            ],
            handler: (item: {key: string}, ids: (string | number)[]) => {
              if (item.key === 'delete') {
                deleteItems(ids as string[]);
              } else if (item.key === 'resolved') {
                alterItems(ids as string[], {status: Status.审核通过});
              } else if (item.key === 'rejected') {
                alterItems(ids as string[], {status: Status.审核拒绝});
              }
            },
          }
        : undefined,
    [alterItems, curRender, deleteItems]
  );

  const columns: MColumns<ListItem>[] = useMemo(
    () => [
      {
        title: '标题',
        dataIndex: 'title',
        ellipsis: {showTitle: false},
        render: (title) => (
          <Tooltip placement="topLeft" title={title}>
            {title}
          </Tooltip>
        ),
      },
      {
        title: '作者',
        dataIndex: 'author',
        width: '10%',
        sorter: true,
        render: (author: {id: string; name: string}) => (
          <Link to={`/admin/member/item/detail/${author.id}`} action="push" target="singleWindow" cname="_dialog">
            {author.name}
          </Link>
        ),
      },
      {
        title: '责任编辑',
        dataIndex: 'editors',
        width: '20%',
        className: 'g-actions',
        render: (editors: {id: string; name: string}[]) =>
          editors.map((editor) => (
            <Link key={editor.id} to={`/admin/member/item/detail/${editor.id}`} action="push" target="singleWindow" cname="_dialog">
              {editor.name}
            </Link>
          )),
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        width: '200px',
        sorter: true,
        timestamp: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: '100px',
        render: (val: string) => (
          <span className={`g-${val === Status.审核拒绝 ? 'disable' : val === Status.审核通过 ? 'enable' : ''}`}>{DStatus.valueToLabel[val]}</span>
        ),
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: '200px',
        align: 'center',
        disable: curRender !== 'maintain',
        render: (id: string, record) => {
          return (
            <div className="g-table-actions">
              <a onClick={() => onShowDetail(id)}>详细</a>
              <Dropdown
                overlay={
                  <Menu
                    onClick={({key}: any) => {
                      alterItems([id], {status: key});
                    }}
                    items={[
                      {label: '审核通过', key: Status.审核通过},
                      {label: '审核拒绝', key: Status.审核拒绝},
                    ]}
                  ></Menu>
                }
              >
                <a>审核</a>
              </Dropdown>
              <a onClick={() => onShowEditor(id, updateItem)}>修改</a>
              <Popconfirm placement="topRight" title="您确定要删除该条数据吗？" onConfirm={() => deleteItems(id)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ],
    [alterItems, curRender, deleteItems, onShowDetail, onShowEditor, updateItem]
  );

  const selection = useMemo(() => (curRender === 'maintain' ? undefined : {limit: -1}), [curRender]);

  return (
    <MTable<ListItem>
      size={curRender === 'maintain' ? 'large' : 'middle'}
      commonActions={commActions}
      batchActions={batchActions}
      onChange={onTableChange}
      columns={columns}
      listSearch={listSearch}
      dataSource={list}
      selectedRows={selectedRows}
      listSummary={listSummary}
      selection={selection}
      loading={listLoading === 'Start' || listLoading === 'Depth'}
    />
  );
};

export default connectRedux(mapStateToProps)(Component);
