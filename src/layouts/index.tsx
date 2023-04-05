
import { useCallback, useEffect, useState } from 'react';

import { Link, Outlet, history, useLocation } from 'umi';
import classnames from 'classnames';
import { MainHeader } from '@/components';

import LOGO_PNG from '@/assets/logo.png';

import styles from './index.less';


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

  const [active, setActive] = useState<string>(getPathName(location.pathname));

  useEffect(() => {
    let pathname = getPathName(location.pathname);
    setActive(pathname)
  }, [location.pathname]);
  //

  const itemClick = useCallback(() => {

  }, []);

  return (
    <div className={styles.container}>
      {/* <MainHeader></MainHeader> */}
      <div className={styles.main}>
        <div data-tauri-drag-region className={styles.navs}>
          <div className={classnames(styles.items)}>
            <div className={classnames(styles.item, styles.img_item, active === 'home' ? styles.active : undefined)} onClick={() => {
              history.push('/home');
            }}>
              <img className={classnames(styles.item_icon)} src={LOGO_PNG}></img>
              <div className={classnames(styles.item_title)}>软软AI</div>
            </div>
            <div className={classnames(styles.item, active === 'chat' ? styles.active : undefined)} onClick={() => {
              history.push('/chat');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-jiqiren')}></div>
              <div className={classnames(styles.item_title)}>AI问答</div>
            </div>
            <div className={classnames(styles.item, active === 'painter' ? styles.active : undefined)} onClick={() => {
              history.push('/painter');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-huihua')}></div>
              <div className={classnames(styles.item_title)}>AI绘画</div>
            </div>
            <div className={classnames(styles.item, active === 'prompts' ? styles.active : undefined)} onClick={() => {
              history.push('/prompts');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-faxian')}></div>
              <div className={classnames(styles.item_title)}>发现</div>
            </div>
            <div className={classnames(styles.item, active === 'tools' ? styles.active : undefined)} onClick={() => {
              history.push('/tools');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-Tools')}></div>
              <div className={classnames(styles.item_title)}>工具箱</div>
            </div>
          </div>

          <div className={classnames(styles.items)}>
            <div className={classnames(styles.item)}>
              <div className={classnames(styles.item_icon, 'iconfont icon-a-205shezhi')}></div>
              <div className={classnames(styles.item_title)}>小程序</div>
            </div>
            <div className={classnames(styles.item, active === 'settings' ? styles.active : undefined)} onClick={() => {
              history.push('/settings/upgrade');
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
    </div>

  );
}
