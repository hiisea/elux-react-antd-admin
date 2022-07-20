import {DashboardOutlined, ProfileOutlined, TeamOutlined} from '@ant-design/icons';
import {CurUser} from '@elux-admin-antd/stage/entity';
import {Dispatch, connectStore} from '@elux/react-web';
import {Menu, MenuProps} from 'antd';
import {ComponentType, FC, useCallback, useMemo, useState} from 'react';
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
    const Icon: any = icon ? ICONS[icon] || ICONS['dashboard'] : undefined;
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
  menuData: MenuItem[];
  menuSelected: {selected: string[]; open: string[]};
}

function mapStateToProps(appState: APPState): StoreProps {
  const {curUser} = appState.stage!;
  const {menuData, menuSelected} = appState.admin!;
  return {curUser, menuData: menuData.items, menuSelected};
}

const {admin: adminActions} = GetActions('admin');

const Component: FC<StoreProps & {dispatch: Dispatch}> = ({dispatch, menuData, menuSelected}) => {
  const menuItems = useMemo(() => {
    return mappingMenuData(menuData);
  }, [menuData]);

  const [openKeys, setOpenKeys] = useState(menuSelected.open);

  useMemo(() => {
    setOpenKeys(menuSelected.open);
  }, [menuSelected.open]);

  const onOpenChange = useCallback((val) => setOpenKeys(val), []);

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
        onOpenChange={onOpenChange}
        selectedKeys={menuSelected.selected}
        openKeys={openKeys}
        mode="inline"
        theme="dark"
        items={menuItems}
      />
    </div>
  );
};

export default connectStore(mapStateToProps)(Component);
