
import { useCallback, useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { Outlet, history, useLocation } from 'umi';
import classnames from 'classnames';
import Controls from '@/components/title-bar/controls/index';
import { windowIsFocused } from '@/components/index';
import LOGO_PNG from '@/assets/logo.png';

import styles from './index.less';
import { getLocalValue, setLocalValue } from '@/utils';

import { init_databases } from '@/databases/index';


(async () => {
  await init_databases();
})()


const getPathName = (url: string): string => {
  console.log(url);
  let temp = url.substring(1);
  if (temp.indexOf("/") > 0) {
    let pathname = temp.substring(0, temp.indexOf("/"));
    console.log(pathname);
    return pathname;
  } else {
    return temp;
  }
};

export default function Layout() {

  const location = useLocation();

  const [active, setActive] = useState<string>('');

  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const windowFocus = () => {
      setIsWindowFocused(true);
    }
    const windowBlur = () => {
      setIsWindowFocused(false);
    }
    //
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', windowFocus);
      window.addEventListener('blur', windowBlur);
    }

    const call = async () => {
      //
      let active = getLocalValue('rrai_active_menu');
      if (!active) {
        active = 'home';
      }
      setActive(active);
    };
    call();


    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', windowFocus);
        window.removeEventListener('blur', windowBlur);
      }
    };
  }, []);

  //
  return (
    <div className={styles.container}>
      <div data-tauri-drag-region className={styles.navs}>
        <div className={classnames(styles.items)}>
          <div className={classnames(styles.controls)}>
            <Controls
              isFullscreen={isFullscreen}
              onCloseClick={async () => {
                await appWindow.close();
              }}
              onMinimizeClick={async () => {
                await appWindow.minimize();
              }}
              onMaximizeClick={async () => {
                if (await appWindow.isMaximized()) {
                  await appWindow.unmaximize();
                  setIsFullscreen(false);
                } else {
                  await appWindow.maximize();
                  setIsFullscreen(true);
                }
              }}
              onResizeClick={async () => {
                if (await appWindow.isMaximized()) {
                  await appWindow.unmaximize();
                  setIsFullscreen(false);
                } else {
                  await appWindow.maximize();
                  setIsFullscreen(true);
                }
              }}
              isWindowFocused={isWindowFocused}></Controls>
          </div>
          <div className={classnames(styles.item, styles.img_item, active === 'home' ? styles.active : undefined)} onClick={() => {
            setLocalValue('rrai_active_menu', 'home');
            setActive('home');
            history.push('/conversation/settings');
          }}>
            <img className={classnames(styles.item_icon)} src={LOGO_PNG}></img>
            <div className={classnames(styles.item_title)}>软软AI</div>
          </div>
          <div className={classnames(styles.item, active === 'chat' ? styles.active : undefined)} onClick={() => {
            setLocalValue('rrai_active_menu', 'chat');
            setActive('chat');
            history.push('/conversation/chat');
          }}>
            <div className={classnames(styles.item_icon, 'iconfont icon-jiqiren')}></div>
            <div className={classnames(styles.item_title)}>AI问答</div>
          </div>
          <div className={classnames(styles.item, active === 'painter' ? styles.active : undefined)} onClick={() => {
            setLocalValue('rrai_active_menu', 'painter');
            setActive('painter');
            history.push('/painter');
          }}>
            <div className={classnames(styles.item_icon, 'iconfont icon-huihua')}></div>
            <div className={classnames(styles.item_title)}>AI绘画</div>
          </div>
          <div className={classnames(styles.item, active === 'prompts' ? styles.active : undefined)} onClick={() => {
            setLocalValue('rrai_active_menu', 'prompts');
            setActive('prompts');
            history.push('/prompts');
          }}>
            <div className={classnames(styles.item_icon, 'iconfont icon-faxian')}></div>
            <div className={classnames(styles.item_title)}>发现</div>
          </div>
          <div className={classnames(styles.item, active === 'tools' ? styles.active : undefined)} onClick={() => {
            setLocalValue('rrai_active_menu', 'tools');
            setActive('tools');
            history.push('/tools/sdinstall');
          }}>
            <div className={classnames(styles.item_icon, 'iconfont icon-Tools')}></div>
            <div className={classnames(styles.item_title)}>工具箱</div>
          </div>
        </div>

        <div className={classnames(styles.items)}>
          <div className={classnames(styles.item, active === 'miniprogram' ? styles.active : undefined)} onClick={() => {
            setLocalValue('rrai_active_menu', 'miniprogram');
            setActive('miniprogram');
            history.push('/miniprogram');
          }}>
            <div className={classnames(styles.item_icon, 'iconfont icon-xiaochengxu')}></div>
            <div className={classnames(styles.item_title)}>小程序</div>
          </div>
          <div className={classnames(styles.item, active === 'settings' ? styles.active : undefined)} onClick={() => {
            setLocalValue('rrai_active_menu', 'settings');
            setActive('settings');
            history.push('/settings/account');
          }}>
            <div className={classnames(styles.item_icon, 'iconfont icon-a-205shezhi')}></div>
            <div className={classnames(styles.item_title)}>设置</div>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>

  );
}
