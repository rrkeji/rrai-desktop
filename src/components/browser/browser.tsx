import React, { useEffect } from 'react';
import classnames from 'classnames';

import styles from './browser.less';

export interface BrowserProps {
    className?: string
    src: string,
    receiveMessage?: (origin: string, type: string, data: any) => void
}

export const Browser: React.FC<BrowserProps> = ({ className, src, receiveMessage }) => {


    useEffect(() => {
        let self = this;    //为了避免作用域及缓存
        const receiveMessageFromIframe = (event: any) => {
            if (event != undefined) {
                console.log(event);
                receiveMessage && receiveMessage(event.origin, event.type, event.data);
            } else {
                console.error('事件对象为空！');
            }
        }
        //监听message事件
        window.addEventListener("message", receiveMessageFromIframe, false);

        return () => {
            //移除事件
            window.removeEventListener("message", receiveMessageFromIframe);
        };
    }, []);

    return (
        <iframe className={classnames(styles.container, className)} src={src}>
        </iframe>
    );
};

export default Browser;