
import { useCallback, useEffect, useState } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import { Outlet, history, useLocation } from 'umi';
import classnames from 'classnames';
import Controls from '@/components/title-bar/controls/index';
import LOGO_PNG from '@/assets/logo.png';
import { TeamOutlined, FileSearchOutlined, ReadOutlined } from '@ant-design/icons';

import styles from './empty.less';
import { getLocalValue, setLocalValue } from '@/utils';

export default function EmptyLayout() {

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
                <div data-tauri-drag-region className={classnames(styles.controls)}>
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
            </div>
            <div data-tauri-drag-region className={styles.content}>
                <Outlet />
            </div>
        </div>

    );
}
