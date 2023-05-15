import React, { useState } from 'react';
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

    const [showHistory, setShowHistory] = useState<boolean>(false);

    return (
        <div className={classnames(styles.container, className)}>
            {
                showHistory ? (
                    <>
                        <div onClick={() => {
                            setShowHistory(!showHistory);
                        }}>
                            历史记录折叠
                        </div>
                    </>
                ) : (
                    <>
                        <DrawingBoard className={classnames(styles.board)} conversation={conversation} conversationId={conversationId}></DrawingBoard>
                        <ImagesViewer className={classnames(styles.content)} conversation={conversation} conversationId={conversationId}></ImagesViewer>
                        <div className={classnames(styles.show_history_button)}
                            onClick={() => {
                                setShowHistory(!showHistory);
                            }}>
                            历史记录展开
                        </div>
                    </>

                )
            }
        </div>
    );
};

export default Text2ImagePainterConversationViewer;