//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import {BellOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined, UserOutlined} from '@ant-design/icons';
import {CurUser} from '@elux-admin-antd/stage/entity';
import {AdminHomeUrl} from '@elux-admin-antd/stage/utils/const';
import {Dispatch, connectStore} from '@elux/react-web';
import {Avatar, Badge, Dropdown, Menu, MenuProps} from 'antd';
import {FC, useCallback, useMemo} from 'react';
import {APPState, GetActions, GetClientRouter, StaticPrefix} from '@/Global';
import {Notices} from '../../entity';
import styles from './index.module.less';

const {stage: stageActions, admin: adminActions} = GetActions('stage', 'admin');

export interface StoreProps {
  curUser: CurUser;
  siderCollapsed?: boolean;
  notices?: Notices;
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {notices, siderCollapsed} = appState.admin!;
  return {curUser, notices, siderCollapsed};
}

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({curUser, notices, siderCollapsed, dispatch}) => {
  const toggleSider = useCallback(() => {
    dispatch(adminActions.putSiderCollapsed(!siderCollapsed));
  }, [siderCollapsed, dispatch]);

  const onUserMenuClick = useCallback(
    ({key}: {key: string}) => {
      if (key === 'logout') {
        dispatch(stageActions.logout());
      } else if (key === 'home') {
        GetClientRouter().relaunch({url: AdminHomeUrl}, 'window');
      }
    },
    [dispatch]
  );

  const userMenu = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        label: '个人中心',
        key: 'home',
        icon: <UserOutlined />,
      },
      {
        label: '退出登录',
        key: 'logout',
        icon: <LogoutOutlined />,
      },
    ];
    return <Menu items={items} onClick={onUserMenuClick}></Menu>;
  }, [onUserMenuClick]);

  return (
    <div className={styles.root}>
      <div className="side">
        {siderCollapsed ? (
          <MenuUnfoldOutlined className="toggle-sider" onClick={toggleSider} />
        ) : (
          <MenuFoldOutlined className="toggle-sider" onClick={toggleSider} />
        )}
        <a href="https://eluxjs.com" target="_blank" rel="noreferrer">
          <QuestionCircleOutlined /> 帮助指南
        </a>
      </div>
      <div className="main">
        <Badge count={notices?.num || 0} className="notice" offset={[-15, 13]}>
          <BellOutlined />
        </Badge>
        <Dropdown overlay={userMenu}>
          <span className="account">
            <Avatar size="small" src={StaticPrefix + curUser.avatar} />
            <span>{curUser.username}</span>
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

export default connectStore(mapStateToProps)(Component);
