import React, { ReactNode, useEffect, useState } from 'react';
import { getMessageByConversationId } from '@/services/message-service';
import { MessageEntity } from '@/databases/conversation/index';
import { Message } from './message';

import classnames from 'classnames';

import styles from './message-list.less';

export interface MessageListProps {
    className?: string;
    conversationType: string;
    conversationId: string;
    beforeNode: ReactNode;
    afterNode: ReactNode;
    systemMessageShown: boolean;
    version: number;
}

export const MessageList: React.FC<MessageListProps> = ({ className, systemMessageShown, beforeNode, conversationType, conversationId, afterNode, version }) => {


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
    }, [conversationType, conversationId, version]);
    //
    return (
        <div className={classnames(styles.container, className)}>
            {beforeNode}
            {
                messages && messages.filter((message, index) => message.botRole !== 'system' || systemMessageShown).map((message, index) => {
                    return (
                        <Message key={index} message={message} editable={message.botRole !== 'system'} onMessageChange={async () => {
                            //
                            await refresh();
                        }}></Message>
                    );
                })
            }
            {afterNode}
        </div >
    );
};

export default MessageList;