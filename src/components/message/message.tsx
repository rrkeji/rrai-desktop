import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';

import styles from './message.less';

export interface MessageProps {
    className?: string;
    editable?: boolean;
    appending?: boolean;
    message: MessageEntity;
    appendMessage?: (message: string) => void;
}

export const Message: React.FC<MessageProps> = ({ }) => {
    return (
        <div className={classnames(styles.container)}>

        </div>
    );
};

export default Message;