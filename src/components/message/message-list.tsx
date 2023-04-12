import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import styles from './message-list.less';

export interface MessageListProps {
    className?: string;
    conversationType: string;
    conversationId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ className, conversationType, conversationId }) => {


    const [messages, setMessages] = useState<Array<any>>([]);

    useEffect(() => {
        //获取到该会话的历史消息

    }, [conversationType, conversationId]);
    //
    return (
        <div className={classnames(styles.container, className)}>
            
        </div>
    );
};

export default MessageList;