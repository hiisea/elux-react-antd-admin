import {PlusOutlined, ReloadOutlined} from '@ant-design/icons';
import {Dispatch, connectRedux} from '@elux/react-web';
import {Tabs} from 'antd';
import {FC, useCallback} from 'react';
import {APPState, GetActions, GetClientRouter} from '@/Global';
import {TabData} from '../../entity';
import Editor from './Editor';
import styles from './index.module.less';

const {TabPane} = Tabs;

const {admin: adminActions} = GetActions('admin');

export interface StoreProps {
  tabData: TabData;
  tabSelected: string;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {tabData, curTab} = appState.admin!;
  return {
    tabData,
    tabSelected: curTab.id,
  };
}

const AddIcon = (
  <div className="btn-add">
    <PlusOutlined />
    <span>收藏</span>
  </div>
);

const Refresh = (
  <div className="btn-refresh" title="刷新" onClick={() => GetClientRouter().replace(GetClientRouter().location)}>
    <ReloadOutlined />
  </div>
);

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({dispatch, tabData, tabSelected}) => {
  const onTabClick = useCallback(
    (key: string) => {
      dispatch(adminActions.clickTab(key));
    },
    [dispatch]
  );
  const onTabEdit = useCallback(
    (key: any, action: 'add' | 'remove') => {
      if (action === 'add') {
        dispatch(adminActions.clickTab(''));
      } else {
        dispatch(adminActions.deleteTab(key));
      }
    },
    [dispatch]
  );

  return (
    <>
      <Tabs
        className={styles.root}
        activeKey={tabSelected}
        type="editable-card"
        size="small"
        onTabClick={onTabClick}
        onEdit={onTabEdit}
        addIcon={AddIcon}
        tabBarExtraContent={Refresh}
      >
        {tabData.list.map((item) => (
          <TabPane tab={item.title} key={item.id}></TabPane>
        ))}
      </Tabs>
      <Editor />
    </>
  );
};

export default connectRedux(mapStateToProps)(Component);
