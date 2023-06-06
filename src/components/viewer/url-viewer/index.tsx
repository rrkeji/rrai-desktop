import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { http } from "@tauri-apps/api";
import { ImageViewer, JsonViewer } from '../index';

import styles from './index.less';

import { FILE_TYPE_IMG_BMP, FILE_TYPE_IMG_JPEG, FILE_TYPE_IMG_GIF, FILE_TYPE_IMG_PNG, FILE_TYPE_IMG_WEBP, FILE_TYPE_JSON } from '../types';
import { Spin } from 'antd';

export interface UrlViewerProps {
    className?: string;
    url: string;
    fileType: string;
}


const getContent = async (url: string): Promise<string> => {
    //
    let response = await http.fetch(url, {
        method: 'GET',
    });
    console.log(response);
    if (response.status === 200) {
        return response.data as string;
    } else {
        return "";
    }
};

export const UrlViewer: React.FC<UrlViewerProps> = ({ className, url, fileType }) => {
    //
    if (fileType === FILE_TYPE_IMG_BMP || fileType === FILE_TYPE_IMG_JPEG
        || fileType === FILE_TYPE_IMG_GIF || fileType === FILE_TYPE_IMG_PNG || fileType === FILE_TYPE_IMG_WEBP) {
        //图片
        return (
            <ImageViewer className={classnames(styles.container, className)} url={url}></ImageViewer>
        );
    }


    const [content, setContent] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        //判断是否是文本类型,进行数据获取
        if (fileType === FILE_TYPE_JSON) {
            //
            getContent(url).then((content) => {
                setContent(content);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
        }
    }, [url, fileType]);

    if (loading) {
        return (
            <div className={classnames(styles.container)}>
                <Spin></Spin>
            </div>
        );
    }

    if (fileType === FILE_TYPE_JSON) {
        //JSON
        return (
            <JsonViewer className={classnames(styles.container, className)} content={content}></JsonViewer>
        );
    }

    return (
        <div className={classnames(styles.container)}>
            {url}
        </div>
    );
};

export default UrlViewer;