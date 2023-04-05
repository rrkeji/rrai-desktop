import { useCallback, useEffect, useState } from 'react';

import { Link, Outlet, history, useLocation } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem } from '@/components/index';

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

    const [active, setActive] = useState<string>(getPathName(location.pathname));

    const [items, setItems] = useState<Array<any>>([]);

    const [current, setCurrent] = useState<string>(location.pathname);

    useEffect(() => {
        let pathname = getPathName(location.pathname);
        setActive(pathname)
        setCurrent(location.pathname);
    }, [location.pathname]);
    //
    useEffect(() => {
        //根据 Pathname 的不同获取不同的二级菜单
        console.log(active);
        let items = sideData[active];
        setItems(items);
    }, [active]);

    const itemClick = useCallback(() => {

    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <SideList className={styles.side}>
                    {
                        items && items.map((item: any, index: number) => {
                            return (
                                <SideListItem
                                    className={classnames(styles.side_item)}
                                    active={current == item.path}
                                    title={item.title}
                                    avatar={<div className={classnames(styles.side_item_avatar, "iconfont icon-a-205shezhi")}></div>}
                                    avatarBackground={'#0493F5'}
                                    onClick={() => {
                                        history.push(item.path);
                                    }}
                                ></SideListItem>
                            );
                        })
                    }
                </SideList>
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
