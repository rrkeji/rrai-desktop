import React from 'react';
import classnames from 'classnames';
import { ConversationEntity, MessageEntity } from '@/databases';
import { DrawingBoard } from '../draw-board/index';
import { ImagesViewer } from '../image-viewer/index';

import styles from './text2image-conversation-viewer.less';

export interface PainterConversationViewerProps {
    className?: string;
    conversationId: string;
    conversation: ConversationEntity
}

export const Text2ImagePainterConversationViewer: React.FC<PainterConversationViewerProps> = ({ className, conversationId, conversation }) => {

    return (
        <div className={classnames(styles.container, className)}>
            <DrawingBoard className={classnames(styles.board)}></DrawingBoard>
            <ImagesViewer className={classnames(styles.content)}></ImagesViewer>
        </div>
    );
};

export default Text2ImagePainterConversationViewer;