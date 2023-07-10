import { ReactNode, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { getConversationsByType, createConversation, queryConversationByUid } from '@/services/conversation-service';
import { ConversationEntity, MessageEntity } from '@/databases';

// import { Text2ImagePainterConversationViewer } from './text2image-conversation-viewer';

import styles from './conversation-viewer.less';

export interface PainterConversationViewerProps {
    className?: string;
    conversationId: string;
}

export const PainterConversationViewer: React.FC<PainterConversationViewerProps> = ({ className, conversationId }) => {

    const [conversation, setConversation] = useState<ConversationEntity | null>(null);

    const refreshConversation = async (conversationId: string) => {
        let res = await queryConversationByUid(conversationId);
        console.log(res);
        if (res != null) {
            setConversation(res);
        } else {
            setConversation(null);
        }
    };

    useEffect(() => {
        //通过会话ID获取会话信息
        const call = async () => {
            await refreshConversation(conversationId);
        };
        call();
    }, [conversationId]);

    if (conversation === null || !conversation.args) {
        return (
            <div className={classnames(styles.container, className)}>

            </div>
        );
    }

    // if (conversation.args['painterType'] === 'text2image') {

    //     return (
    //         <Text2ImagePainterConversationViewer
    //             className={classnames(styles.container, className)}
    //             conversationId={conversationId}
    //             conversation={conversation}
    //         ></Text2ImagePainterConversationViewer>
    //     );
    // }

    return (
        <div className={classnames(styles.container, className)}>

        </div>
    );
};

export default PainterConversationViewer;