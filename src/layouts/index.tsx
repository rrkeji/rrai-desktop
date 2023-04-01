
import { useCallback, useEffect, useState } from 'react';

import { Link, Outlet, history, useLocation } from 'umi';
import classnames from 'classnames';
import { MainHeader } from '@/components';

import LOGO_PNG from '@/assets/logo.png';

import styles from './index.less';

export default function Layout() {

  const location = useLocation();

  const [active, setActive] = useState<string>('/home');

  useEffect(() => {
    setActive(location.pathname)
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
            <div className={classnames(styles.item, styles.img_item, active === '/home' ? styles.active : undefined)} onClick={() => {
              history.push('/home');
            }}>
              <img className={classnames(styles.item_icon)} src={LOGO_PNG}></img>
              <div className={classnames(styles.item_title)}>软软AI</div>
            </div>
            <div className={classnames(styles.item, active === '/chat' ? styles.active : undefined)} onClick={() => {
              history.push('/chat');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-lunyu')}></div>
              <div className={classnames(styles.item_title)}>AI闲聊</div>
            </div>
            <div className={classnames(styles.item, active === '/painter' ? styles.active : undefined)} onClick={() => {
              history.push('/painter');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-lunyu')}></div>
              <div className={classnames(styles.item_title)}>AI绘画</div>
            </div>
            <div className={classnames(styles.item, active === '/models' ? styles.active : undefined)} onClick={() => {
              history.push('/models');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-lunyu')}></div>
              <div className={classnames(styles.item_title)}>模型</div>
            </div>
            <div className={classnames(styles.item, active === '/tools' ? styles.active : undefined)} onClick={() => {
              history.push('/tools');
            }}>
              <div className={classnames(styles.item_icon, 'iconfont icon-lunyu')}></div>
              <div className={classnames(styles.item_title)}>工具箱</div>
            </div>
          </div>

          <div className={classnames(styles.items)}>
            <div className={classnames(styles.item)}>
              <div className={classnames(styles.item_icon, 'iconfont icon-a-205shezhi')}></div>
              <div className={classnames(styles.item_title)}>小程序</div>
            </div>
            <div className={classnames(styles.item, active === '/settings' ? styles.active : undefined)}>
              <div className={classnames(styles.item_icon, 'iconfont icon-a-205shezhi')} onClick={() => {
                history.push('/settings');
              }}></div>
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
