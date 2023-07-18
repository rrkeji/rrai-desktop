import React, { ReactNode, useEffect, useState } from 'react';
import classnames from 'classnames';
import { LocalTaskEntity } from '@/databases/task';
import { getLocalTasksByTaskType } from '@/services/local-task-service';
import { Table, Button, Pagination, Divider } from 'antd';

import styles from './text2image-message-list.less';

export interface Text2ImageMessageListProps {
    className?: string;
    version: number;
    back: () => Promise<any>;
}

export const Text2ImageMessageList: React.FC<Text2ImageMessageListProps> = ({ className, version, back }) => {

    const [loading, setLoading] = useState<boolean>(false);

    const [messages, setMessages] = useState<Array<any>>([]);

    const [page, setPage] = useState<number>(1);

    const [pageSize, setPageSize] = useState<number>(5);

    const [total, setTotal] = useState<number>(0);

    const [current, setCurrent] = useState<number>(0);

    const refresh = async (page: number, pageSize: number,) => {

        const TASK_TYPE = "AI_STABLE_DIFFUSION";

        const TASK_ABILITY = "AI_STABLE_DIFFUSION_WEBUI";

        setLoading(true);
        try {
            let res = await getLocalTasksByTaskType(TASK_TYPE, TASK_ABILITY, page, pageSize);
            setTotal(res.total);
            setMessages(res.data.map((item) => {
                return {
                    images: JSON.parse(item.result),
                    ...JSON.parse(item.args),
                };
            }));
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }
    useEffect(() => {
        //获取列表
        refresh(page, pageSize);
    }, [version, page, pageSize]);

    const columns = [
        {
            title: '提示词',
            dataIndex: 'prompt',
            key: 'prompt',
            width: '30%'
        },
        {
            title: '反向提示词',
            dataIndex: 'negative_prompt',
            key: 'negative_prompt',
            width: '30%'
        },
        {
            title: '数量',
            dataIndex: 'batch_size',
            key: 'batch_size',
        },
        {
            title: '图片',
            dataIndex: 'images',
            key: 'images',
            render: (_, record: any) => {
                let images = record.images;
                console.log(images);
                return (
                    <>
                        {images.map((image: string) => {
                            if (image.indexOf('rrfile') >= 0) {
                                return (
                                    <img className={styles.image} src={`${image}`} width={120} height={120}></img>
                                );
                            } else {
                                return (
                                    <img className={styles.image} src={`rrfile://localhost${image}`} width={120} height={120}></img>
                                );
                            }

                        })}
                    </>
                );
            }
        },
    ];



    //
    return (
        <div className={classnames(styles.container, className)}>
            <Table
                title={() => {
                    return (
                        <>
                            <Button onClick={
                                () => {
                                    back();
                                }
                            }>返回</Button>
                        </>
                    );
                }}
                loading={loading}
                pagination={false}
                dataSource={messages} columns={columns} />
            <Divider></Divider>
            <Pagination
                total={total}
                current={page}
                pageSize={pageSize}
                pageSizeOptions={[5, 10, 20, 50]}
                onChange={(newPage, nePpageSize) => {
                    console.log(newPage, nePpageSize);
                    setPage(newPage);
                    setPageSize(nePpageSize);
                    refresh(newPage, nePpageSize,);
                }}
                onShowSizeChange={(current, size) => {
                    setPageSize(size);
                }} />
        </div >
    );
};

export default Text2ImageMessageList;