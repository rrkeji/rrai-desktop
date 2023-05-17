import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { ConversationEntity, MessageEntity } from '@/databases';
import { DrawingBoard } from '../draw-board/index';
import { ImageCarouselViewer } from '../image-viewer/index';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { getLastMessageByConversationId } from '@/services/message-service';
import { performTaskStdout, performTaskStderr, performTaskStatus } from '@/tauri/abilities/index';

import { Empty, Button, Spin, Row, Col } from 'antd';
import styles from './text2image-conversation-viewer.less';

export interface PainterConversationViewerProps {
    className?: string;
    conversationId: string;
    conversation: ConversationEntity
}

export const Text2ImagePainterConversationViewer: React.FC<PainterConversationViewerProps> = ({ className, conversationId, conversation }) => {

    const [showHistory, setShowHistory] = useState<boolean>(false);

    const [lastMessage, setLastMessage] = useState<MessageEntity | null | {}>({});

    const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

    const [waiting, setWaiting] = useState<boolean>(false);

    const [stdout, setStdout] = useState<Array<string>>([]);

    const [stderr, setStderr] = useState<Array<string>>([]);

    const refresh = async (conversationId: string) => {
        let res: any = await getLastMessageByConversationId(conversationId);
        console.log(res);
        // setLastMessage(res);
        //res.purposeId 'local'
        if (res && res.typing === 'false') {
            //正在
            setWaiting(true);
            setRunningTaskId(res.senderId);
        } else {
            //完成
            setWaiting(false);
            setRunningTaskId(res.senderId);
        }
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

    const queryTaskStatus = async (taskId: string) => {
        console.log(taskId);

        let res2: Array<any> = await performTaskStatus('StableDiffusion', taskId, false);
        console.log(res2);
        if (res2[0]) {
            //完成, 更新Message
            setWaiting(false);
        } else {
            let stdouts = await performTaskStdout('StableDiffusion', taskId);
            setStdout(stdout.concat(stdouts));

            let stderrs = await performTaskStderr('StableDiffusion', taskId);
            setStderr(stderr.concat(stderrs));

            // setTimeout(async () => {
            //     await queryTaskStatus(taskId);
            // }, 10000);
        }
    };

    const contentElement = (waiting: boolean, taskId: string | null) => {
        if (waiting) {
            if (taskId != null) {
                // queryTaskStatus(taskId);
            }

            //
            return (
                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', 'alignItems': 'center', justifyContent: 'center' }}>
                    <Spin tip="Loading" size="large">
                        <div className={styles.spin_content} />
                    </Spin>
                    <Button onClick={async () => {
                        console.log('-------111');
                        let res = await queryTaskStatus(runningTaskId!);
                        console.log('-------222');
                    }}>测试</Button>
                    <Row>
                        <Col span={12}>
                            {stdout && stdout.map((line, index) => {
                                return (
                                    <div>
                                        {line}
                                    </div>
                                );
                            })}
                        </Col>
                        <Col span={12}>
                            {stderr && stderr.map((line, index) => {
                                return (
                                    <div>
                                        {line}
                                    </div>
                                );
                            })}
                        </Col>
                    </Row>
                </div>
            );
        } else if (lastMessage !== null) {
            return (
                <ImageCarouselViewer className={classnames(styles.content)} conversation={conversation} conversationId={conversationId}></ImageCarouselViewer>
            );
        } else {
            return (
                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', 'alignItems': 'center', justifyContent: 'center' }}>
                    <Empty description={'请在左侧运行任务'} />
                </div>
            );
        }
    };

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
                        <DrawingBoard className={classnames(styles.board)} conversation={conversation} conversationId={conversationId}
                            onMessageCreated={async (res) => {
                                let runningTaskId = res.taskResult.runningTaskId;
                                setRunningTaskId(runningTaskId);
                            }}></DrawingBoard>
                        {contentElement(waiting, runningTaskId)}
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