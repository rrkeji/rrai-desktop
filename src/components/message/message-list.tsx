import React, { useEffect, useState } from 'react';
import { getMessageByConversationId } from '@/services/message-service';
import { MessageEntity } from '@/databases/conversation/index';
import { MessageBlock } from './blocks/index';

import classnames from 'classnames';

import styles from './message-list.less';

export interface MessageListProps {
    className?: string;
    conversationType: string;
    conversationId: string;
    conversationName: string;
}

export const MessageList: React.FC<MessageListProps> = ({ className, conversationType, conversationId, conversationName }) => {


    const [messages, setMessages] = useState<Array<MessageEntity>>([]);

    const refresh = async () => {
        let res = await getMessageByConversationId(conversationId);
        console.log(res);
        setMessages(res.data);
    }

    useEffect(() => {
        const call = async () => {
            //获取到该会话的历史消息
            await refresh();
        }
        call();
    }, [conversationType, conversationId]);
    //
    return (
        <div className={classnames(styles.container, className)}>
            {
                messages && messages.map((message, index) => {
                    return (
                        <MessageBlock key={index} message={message}></MessageBlock>
                    );
                })
            }
        </div>
    );
};

export default MessageList;