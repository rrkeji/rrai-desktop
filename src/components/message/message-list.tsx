import React, { useState } from 'react';
import classnames from 'classnames';

import styles from './message-list.less';

export interface MessageListProps {
    className?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ className }) => {


    const [messages, setMessages] = useState<Array<any>>([]);

    //
    return (
        <div className={classnames(styles.container, className)}>
            slssslll
        </div>
    );
};

export default MessageList;