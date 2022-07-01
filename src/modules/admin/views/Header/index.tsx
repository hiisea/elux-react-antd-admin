//通常模块可以定义一个根视图，根视图中显示什么由模块自行决定，父级不干涉，相当于子路由
import {BellOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, QuestionCircleOutlined, UserOutlined} from '@ant-design/icons';
import {CurUser} from '@elux-admin-antd/stage/entity';
import {Dispatch, Link, connectRedux} from '@elux/react-web';
import {Avatar, Badge, Dropdown, Menu, MenuProps} from 'antd';
import {FC, useCallback, useMemo} from 'react';
import {APPState, GetActions, StaticPrefix} from '@/Global';
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
      }
    },
    [dispatch]
  );

  const userMenu = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        label: '个人中心',
        key: 'my',
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
        <Link to="">
          <QuestionCircleOutlined /> 帮助指南
        </Link>
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

export default connectRedux(mapStateToProps)(Component);
