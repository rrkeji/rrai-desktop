import React from 'react';
import classnames from 'classnames';

import styles from './message-list.less';

export interface MessageListProps {

}

export const MessageList: React.FC<MessageListProps> = ({ }) => {
    //
    return (
        <div className={classnames(styles.container)}>

        </div>
    );
};

export default MessageList;