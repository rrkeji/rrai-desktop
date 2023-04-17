import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { UserAvatar } from '@/components/avatars/index';
import { MessageBlock } from '@/components/message/blocks/index';

import styles from './message.less';

export interface MessageProps {
    className?: string;
    editable?: boolean;
    appending?: boolean;
    message: MessageEntity;
}

export const Message: React.FC<MessageProps> = ({ className, editable, message, appending }) => {

    return (
        <div className={classnames(styles.container)}>
            <UserAvatar className={classnames(styles.avatar)}></UserAvatar>
            <MessageBlock className={classnames(styles.message)} message={message}></MessageBlock>
        </div>
    );
};

export default Message;