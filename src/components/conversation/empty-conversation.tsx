import React from 'react';
import classnames from 'classnames';
import { ConversationBar, AddConversation } from '@/components/conversation/index';
import styles from './empty-conversation.less';

export interface EmptyConversationProps {
    className?: string
}

export const EmptyConversation: React.FC<EmptyConversationProps> = ({ className }) => {
    return (
        <div className={classnames(styles.container, className)}>
            <ConversationBar
                title={''} className={styles.bar} ></ConversationBar>
            <div className={styles.content}></div>
        </div>
    );
};

export default EmptyConversation;