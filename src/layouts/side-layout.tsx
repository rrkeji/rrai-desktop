import { useCallback, useEffect, useState } from 'react';

import { Link, Outlet, history, useLocation } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem, SideHeader } from '@/components/index';
import { ConversationBar } from '@/components/conversation/index';
import { Divider } from 'antd';
import { getLocalValue } from '@/utils';

import styles from './side-layout.less';

import sideData from './side-data';

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


export default function SideLayout() {

    const location = useLocation();

    const [active, setActive] = useState<string | null>(getLocalValue('rrai_active_menu'));

    const [items, setItems] = useState<Array<any>>([]);

    const [menuFolded, setMenuFolded] = useState<boolean>(false);

    useEffect(() => {
        let active = getLocalValue('rrai_active_menu');
        if (!active) {
            active = 'home';
        }
        setActive(active);
    }, [location.pathname]);

    //
    useEffect(() => {
        if (!active) {
            return;
        }
        //根据 Pathname 的不同获取不同的二级菜单
        let items = sideData[active];
        setItems(items);
    }, [active]);

    return (
        <>
            {
                menuFolded ? ('') : (
                    <SideList data-tauri-drag-region className={styles.side}>
                        <div data-tauri-drag-region className={styles.height24}></div>
                        {
                            items && items.map((item: any, index: number) => {

                                if (item.type == 'ReactNode') {
                                    return (
                                        <div key={index} className={classnames(styles.side_item)}>
                                            {item.node}
                                        </div>
                                    );
                                } else if (item.type == 'Divider') {
                                    return (
                                        <Divider key={index} style={{ margin: '12px 0' }}></Divider>
                                    );
                                } else {
                                    return (
                                        <SideListItem
                                            key={index}
                                            className={classnames(styles.side_item)}
                                            active={location.pathname == item.path || (item.type === 'URL' && `/browser/${encodeURIComponent(item.path)}` == location.pathname)}
                                            title={item.title}
                                            avatar={<div className={classnames(styles.side_item_avatar, "iconfont icon-a-205shezhi")}></div>}
                                            avatarBackground={'#0493F5'}
                                            onClick={() => {
                                                if (item.type === 'URL') {
                                                    history.push(`/browser/${encodeURIComponent(item.path)}`);
                                                } else {
                                                    history.push(item.path);
                                                }
                                            }}
                                        ></SideListItem>
                                    );
                                }

                            })
                        }
                    </SideList>
                )
            }
            <div className={styles.content}>
                <Outlet />
            </div>
        </>
    );
}
