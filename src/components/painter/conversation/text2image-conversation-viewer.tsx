import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { ConversationEntity, MessageEntity } from '@/databases';
import { DrawingBoard } from '../draw-board/index';
import { ImageCarouselViewer } from '../image-viewer/index';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { getLastMessageByConversationId } from '@/services/message-service';
import { performTaskStdout, performTaskStatus } from '@/tauri/abilities/index';

import { Empty, Button } from 'antd';
import styles from './text2image-conversation-viewer.less';

export interface PainterConversationViewerProps {
    className?: string;
    conversationId: string;
    conversation: ConversationEntity
}

export const Text2ImagePainterConversationViewer: React.FC<PainterConversationViewerProps> = ({ className, conversationId, conversation }) => {

    const [showHistory, setShowHistory] = useState<boolean>(false);

    const [lastMessage, setLastMessage] = useState<MessageEntity | null | {}>({});

    const [runningTaskId, setRunningTaskId] = useState<string | null>('e170239daef442e5812b6182038cfa7a');

    const refresh = async (conversationId: string) => {
        let res = await getLastMessageByConversationId(conversationId);
        console.log(res);
        // setLastMessage(res);
    };

    useEffect(() => {
        //获取该会话最近的消息
        refresh(conversationId);
    }, [conversationId]);

    // useEffect(() => {
    //     // 
    //     const call = async () => {
    //         let res = await performTaskStdout('StableDiffusion', runningTaskId!, 10);
    //         console.log(res);
    //         let res2 = await performTaskStatus('StableDiffusion', runningTaskId!, true);
    //         console.log(res2);
    //     };
    //     call();
    // }, [runningTaskId]);

    return (
        <div className={classnames(styles.container, className)}>
            {
                showHistory ? (
                    <>
                        <div className={classnames(styles.unshow_history_button)} onClick={() => {
                            setShowHistory(!showHistory);
                        }}>
                            历史记录折叠
                            {/* <div><DoubleRightOutlined /></div> */}
                        </div>
                    </>
                ) : (
                    <>
                        <DrawingBoard className={classnames(styles.board)} conversation={conversation} conversationId={conversationId}></DrawingBoard>
                        {
                            lastMessage == null ? (
                                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', 'alignItems': 'center', justifyContent: 'center' }}>
                                    <Empty description={'请在左侧运行任务'} />
                                    <Button onClick={async () => {
                                        console.log('-------111');
                                        let res = await performTaskStdout('StableDiffusion', runningTaskId!, 10);
                                        console.log(res);
                                        console.log('-------222');
                                        let res2 = await performTaskStatus('StableDiffusion', runningTaskId!, true);
                                        console.log(res2);
                                    }}>测试</Button>
                                </div>
                            ) : (
                                <ImageCarouselViewer className={classnames(styles.content)} conversation={conversation} conversationId={conversationId}></ImageCarouselViewer>
                            )
                        }
                        <div className={classnames(styles.show_history_button)}
                            onClick={() => {
                                setShowHistory(!showHistory);
                            }}>
                            {/* <div><DoubleLeftOutlined /></div> */}
                            历史记录展开
                        </div>
                    </>
                )
            }
        </div>
    );
};



const TaskLoading = () => {

}

export default Text2ImagePainterConversationViewer;