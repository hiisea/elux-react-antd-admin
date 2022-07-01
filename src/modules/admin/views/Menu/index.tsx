import {DashboardOutlined, ProfileOutlined, TeamOutlined} from '@ant-design/icons';
import LoadingPanel from '@elux-admin-antd/stage/components/LoadingPanel';
import {CurUser} from '@elux-admin-antd/stage/entity';
import {Dispatch, Link, LoadingState, connectRedux} from '@elux/react-web';
import {Avatar, Badge, Dropdown, Menu, MenuProps} from 'antd';
import {ComponentType, FC, ReactNode, useCallback, useMemo} from 'react';
import {APPState, GetActions} from '@/Global';
import {MenuItem} from '../../entity';
import styles from './index.module.less';

const ICONS: {[key: string]: ComponentType} = {
  dashboard: DashboardOutlined,
  user: TeamOutlined,
  post: ProfileOutlined,
};
type AntdMenuItem = Required<MenuProps>['items'][number];

function mappingMenuData(menuData: MenuItem[]): AntdMenuItem[] {
  return menuData.map(({label, key, match, link, icon, children}) => {
    const Icon = icon ? ICONS[icon] || ICONS['dashboard'] : undefined;
    return {
      label,
      key,
      icon: Icon && <Icon />,
      children: children && mappingMenuData(children),
    };
  });
}

export interface StoreProps {
  curUser: CurUser;
  siderCollapsed?: boolean;
  menuData: MenuItem[];
  menuSelected: {selected: string[]; open: string[]};
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {siderCollapsed, menuData, menuSelected} = appState.admin!;
  return {curUser, siderCollapsed, menuData: menuData.items, menuSelected};
}

const {admin: adminActions} = GetActions('admin');

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({dispatch, siderCollapsed, menuData, menuSelected}) => {
  const menuItems = useMemo(() => {
    return mappingMenuData(menuData);
  }, [menuData]);

  const onClick = useCallback(
    ({key}: any) => {
      dispatch(adminActions.clickMenu(key));
    },
    [dispatch]
  );
  return (
    <div className={styles.root}>
      <Menu
        onClick={onClick}
        defaultSelectedKeys={menuSelected.selected}
        defaultOpenKeys={menuSelected.open}
        mode="inline"
        theme="dark"
        inlineCollapsed={siderCollapsed}
        items={menuItems}
      />
    </div>
  );
};

export default connectRedux(mapStateToProps)(Component);
