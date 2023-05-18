import React, { ReactNode, useEffect, useState } from 'react';
import classnames from 'classnames';
import { ConversationEntity, MessageEntity } from '@/databases';
import { getMessageByConversationId } from '@/services/message-service';

import styles from './text2image-message-list.less';

export interface Text2ImageMessageListProps {
    className?: string;
    conversationId: string;
    conversation: ConversationEntity;
    beforeNode?: ReactNode;
    afterNode?: ReactNode;
    version: number;
}

export const Text2ImageMessageList: React.FC<Text2ImageMessageListProps> = ({ className, conversationId, conversation, version, beforeNode, afterNode }) => {

    const [messages, setMessages] = useState<Array<MessageEntity>>([]);

    const refresh = async (conversationId: string) => {
        let res = await getMessageByConversationId(conversationId);
        setMessages(res.data);
    }

    useEffect(() => {
        //获取列表
        refresh(conversationId);
    }, [conversationId]);

    //
    return (
        <div className={classnames(styles.container, className)}>
            {beforeNode}
            {
                messages && messages.map((message, index) => {

                    console.log(message);

                    return (
                        <div key={index}>
                            sss
                        </div>
                    );
                })
            }
            {afterNode}
        </div >
    );
};

export default Text2ImageMessageList;