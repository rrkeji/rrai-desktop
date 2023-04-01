import React from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { Avatar, Input, Popover, Divider } from 'antd';
import {
  UserOutlined,
  EllipsisOutlined,
  ExpandAltOutlined,
  CloseOutlined,
  MinusOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

// import { useHistory, useLocation, useParams } from 'umi';

import UDI_PNG from '@/assets/logo_256.png';

import styles from './main-header.less';

// import { clearLocalValue, logout } from '@/utils';

export const MainHeader = () => {
  return (
    <div data-tauri-drag-region className={styles.conatiner}>
      <div data-tauri-drag-region className={styles.left}>
        <div data-tauri-drag-region className={styles.window_butttons}>
          <div
            className={styles.window_button}
            style={{ backgroundColor: '#FE5752' }}
            onClick={() => {
              appWindow.close();
            }}
          >
            <CloseOutlined className={styles.window_button_icon} />
            <EllipsisOutlined className={styles.window_button_icon_normal} />
          </div>

          <div
            className={styles.window_button}
            style={{ backgroundColor: '#E7BB2B' }}
            onClick={() => {
              appWindow.minimize();
            }}
          >
            <MinusOutlined className={styles.window_button_icon} />
            <EllipsisOutlined className={styles.window_button_icon_normal} />
          </div>
          <div
            className={styles.window_button}
            style={{ backgroundColor: '#58C024' }}
            onClick={() => {
              appWindow.maximize();
            }}
          >
            <ExpandAltOutlined className={styles.window_button_icon} />
            <EllipsisOutlined className={styles.window_button_icon_normal} />
          </div>
        </div>
        <div data-tauri-drag-region className={styles.logo}>
          <img src={UDI_PNG} className={styles.logo_png} />
          <div className={styles.logo_title}>优帝测评</div>
        </div>
      </div>
      <div data-tauri-drag-region className={styles.right}>
        <div data-tauri-drag-region></div>
        <div data-tauri-drag-region className={styles.tools}>
          <Popover
            trigger={'click'}
            placement="bottomRight"
            content={<HeaderPopover></HeaderPopover>}
          >
            <Avatar
              style={{ backgroundColor: '#C1D5FA' }}
              icon={<UserOutlined />}
            />
          </Popover>
        </div>
      </div>
    </div>
  );
};

export const HeaderToolButton = (props: {
  icon: any;
  title: any;
  onClick?: () => void;
}) => {
  return (
    <div className={styles.tool_button} onClick={props.onClick}>
      <div className={styles.tool_button_icon}>{props.icon}</div>
      <div className={styles.tool_button_title}>{props.title}</div>
    </div>
  );
};

export const HeaderPopover = (props: {}) => {
  const history: any = useHistory();

  return (
    <div className={styles.popover}>
      <HeaderToolButton
        icon={<SettingOutlined />}
        title={'设置'}
      ></HeaderToolButton>
      <Divider style={{ margin: 0 }}></Divider>
      <HeaderToolButton
        icon={<LogoutOutlined />}
        title={'退出登录'}
        onClick={() => {
          //
          // logout();
          history.push('/login');
        }}
      ></HeaderToolButton>
    </div>
  );
};

export default MainHeader;
