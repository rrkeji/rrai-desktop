import React, { ReactNode, useEffect, useState } from 'react';
import classnames from 'classnames';
import { ConversationEntity, MessageEntity } from '@/databases';
import { getMessageByConversationId } from '@/services/message-service';
import { Table, Button } from 'antd';

import styles from './text2image-message-list.less';

export interface Text2ImageMessageListProps {
    className?: string;
    conversationId: string;
    conversation: ConversationEntity;
    beforeNode?: ReactNode;
    afterNode?: ReactNode;
    version: number;
    back: () => Promise<any>;
}

export const Text2ImageMessageList: React.FC<Text2ImageMessageListProps> = ({ className, conversationId, conversation, version, beforeNode, afterNode, back }) => {

    const [messages, setMessages] = useState<Array<MessageEntity>>([]);

    const refresh = async (conversationId: string) => {
        let res = await getMessageByConversationId(conversationId);
        setMessages(res.data);
    }

    useEffect(() => {
        //获取列表
        refresh(conversationId);
    }, [conversationId]);

    const columns = [
        {
            title: '提示词',
            dataIndex: 'prompts',
            key: 'prompts',
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
            dataIndex: 'batchSize',
            key: 'batchSize',
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
            {beforeNode}
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
                dataSource={messages.map((message, index) => {
                    if (!message) {
                        return [];
                    }
                    console.log(message);

                    let options: any = {};
                    if (message.modelOptions && message.modelOptions.length > 0) {
                        options = JSON.parse(message.modelOptions);
                    }
                    let result = [];
                    if (message.text && message.text.length > 0) {
                        try {
                            result = JSON.parse(message.text);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    console.log(message);
                    return {
                        prompts: options.prompts,
                        negative_prompt: options.negative_prompt,
                        size: options.prompts,
                        batchSize: options.batch_size,
                        images: result,
                    }
                })} columns={columns} />

            {afterNode}
        </div >
    );
};

export default Text2ImageMessageList;