

import React, { useEffect } from 'react';
import { Block, TextBlock, CodeBlock, inferCodeLanguage, parseBlocks } from './block/index';

import { MessageEntity } from '@/databases/conversation/index';
import classnames from 'classnames';
import { _TextBlock } from './viewer/index';

import styles from './block-facade.less';

export interface MessageBlockProps {
    className?: string;
    appending?: boolean;
    message: MessageEntity;
    appendMessage?: (message: string) => void;
}

export const MessageBlock: React.FC<MessageBlockProps> = ({ className, message, appending, appendMessage }) => {

    const fromAssistant = message.botRole === 'assistant';
    const fromSystem = message.botRole === 'system';
    const fromUser = message.botRole === 'user';
    const wasEdited = false;

    const [isHovering, setIsHovering] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

    const blockType: string = '';

    return (
        <_TextBlock message={message} className={className}></_TextBlock>
    );
};


export default MessageBlock;