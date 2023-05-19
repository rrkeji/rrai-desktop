import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { ConversationEntity, MessageEntity } from '@/databases';
import { DrawingBoard } from '../draw-board/index';
import { ImageCarouselViewer } from '../image-viewer/index';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { getLastMessageByConversationId, updateTaskMessage } from '@/services/message-service';
import { performTaskStdout, performTaskStderr, performTaskStatus } from '@/tauri/abilities/index';
import { Text2ImageMessageList } from '../message/index';
import { Empty, Button, Spin, Row, Col } from 'antd';
import styles from './text2image-conversation-viewer.less';

export interface PainterConversationViewerProps {
    className?: string;
    conversationId: string;
    conversation: ConversationEntity
}

let timeoutHandle: NodeJS.Timeout | null = null;

export const Text2ImagePainterConversationViewer: React.FC<PainterConversationViewerProps> = ({ className, conversationId, conversation }) => {

    const [showHistory, setShowHistory] = useState<boolean>(false);

    const [lastMessage, setLastMessage] = useState<MessageEntity | null>(null);

    const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

    const [progress, setProgress] = useState<'empty' | 'waiting' | 'completed' | 'fail'>('empty');

    const [stdout, setStdout] = useState<Array<string>>([]);

    const [stderr, setStderr] = useState<Array<string>>([]);

    const [messageListVersion, setMessageListVersion] = useState<number>(new Date().getTime());

    const refresh = async (conversationId: string) => {
        let res: any = await getLastMessageByConversationId(conversationId);
        console.log(res);
        if (res == null) {
            setLastMessage(null);
        } else {
            setLastMessage(res);
            //res.purposeId 'local'
            if (res.typing === 'false') {
                //正在
                setProgress('waiting');
                setRunningTaskId(res.senderId);
            } else if (res.typing === 'fail') {
                //失败
                setProgress('fail');
                setRunningTaskId(res.senderId);
            } else {
                //完成
                setProgress('completed');
                setRunningTaskId(res.senderId);
            }
        }

    };

    useEffect(() => {
        //获取该会话最近的消息
        refresh(conversationId);
    }, [conversationId]);


    useEffect(() => {
        //
        if (runningTaskId === null || lastMessage === null) {
            return;
        }
        let message = lastMessage;
        let taskId = runningTaskId;
        //
        queryTaskStatus(runningTaskId, lastMessage);

        return () => {
            if (timeoutHandle !== null) {
                clearTimeout(timeoutHandle);
                timeoutHandle = null;
            }
        };
    }, [runningTaskId, lastMessage]);

    const queryTaskStatus = async (taskId: string, message: MessageEntity) => {
        try {
            let res2: Array<any> = await performTaskStatus('StableDiffusion', taskId, false);
            console.log(res2);
            if (res2[0]) {
                //完成, 更新Message
                await updateTaskMessage(message.id, "result", "true");
                setProgress('completed');
            } else {
                let stdouts = await performTaskStdout('StableDiffusion', taskId);
                setStdout(stdout.concat(stdouts));

                let stderrs = await performTaskStderr('StableDiffusion', taskId);
                setStderr(stderr.concat(stderrs));

                if (timeoutHandle !== null) {
                    clearTimeout(timeoutHandle);
                    timeoutHandle = null;
                }
                timeoutHandle = setTimeout(async () => {
                    await queryTaskStatus(taskId, message);
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            //查询不到该任务，异常
            await updateTaskMessage(message.id, "", "fail");
        }
    };

    const contentElement = (progress: 'empty' | 'waiting' | 'completed' | 'fail', taskId: string | null, message: MessageEntity) => {
        if (progress === 'empty') {
            return (
                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', 'alignItems': 'center', justifyContent: 'center' }}>
                    <Empty description={'请在左侧运行任务'} />
                </div>
            );
        } else if (progress === 'waiting') {
            if (taskId != null) {
                // if (timeoutHandle !== null) {
                //     clearTimeout(timeoutHandle);
                //     timeoutHandle = null;
                // }
                // timeoutHandle = setTimeout(async () => {
                //     await queryTaskStatus(taskId, message);
                // }, 1000);
            }

            //
            return (
                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', 'alignItems': 'center', justifyContent: 'center' }}>
                    <Spin tip="Loading" size="large">
                        <div className={styles.spin_content} />
                    </Spin>
                    <Button onClick={async () => {
                        console.log('-------111');
                        let res = await queryTaskStatus(runningTaskId!, message);
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
        } else if (progress === 'completed') {
            return (
                <ImageCarouselViewer className={classnames(styles.content)} conversation={conversation} conversationId={conversationId}></ImageCarouselViewer>
            );
        } else {
            return (
                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', 'alignItems': 'center', justifyContent: 'center' }}>
                    <Empty description={'执行任务中断或者失败!'} />
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
                            图片生成
                            {/* <div><DoubleRightOutlined /></div> */}
                        </div>
                        <Text2ImageMessageList className={classnames(styles.content)}
                            conversation={conversation} conversationId={conversationId} version={messageListVersion}></Text2ImageMessageList>
                    </>
                ) : (
                    <>
                        <DrawingBoard className={classnames(styles.board)} conversation={conversation} conversationId={conversationId}
                            onMessageCreated={async (res) => {
                                let runningTaskId = res.taskResult.runningTaskId;
                                setRunningTaskId(runningTaskId);
                            }}></DrawingBoard>
                        {contentElement(progress, runningTaskId, lastMessage!)}
                        <div className={classnames(styles.show_history_button)}
                            onClick={() => {
                                setShowHistory(!showHistory);
                            }}>
                            {/* <div><DoubleLeftOutlined /></div> */}
                            历史记录
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