import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { ConversationEntity, MessageEntity } from '@/databases';
import { DrawingBoard } from '../draw-board/index';
import { ImageCarouselViewer } from '../image-viewer/index';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { getLastMessageByConversationId, updateTaskMessage } from '@/services/message-service';
import { performTaskStatus } from '@/tauri/abilities/index';
import { Text2ImageMessageList } from '../message/index';
import { Empty, Button, Spin, Row, Col } from 'antd';
import { TaskLogView } from '@/components/tasks/index';

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

    const [result, setResult] = useState<Array<string>>([]);

    const [messageListVersion, setMessageListVersion] = useState<number>(new Date().getTime());

    const refresh = async (conversationId: string) => {
        let res: any = await getLastMessageByConversationId(conversationId);
        console.log(res);
        if (res == null) {
            setLastMessage(null);
        } else {
            setLastMessage(res);
            setRunningTaskId(res.senderId);
            //res.purposeId 'local'
            if (res.typing === 'false') {
                //正在
                setProgress('waiting');
            } else if (res.typing === 'fail') {
                //失败
                setProgress('fail');
            } else {
                //完成
                setProgress('completed');
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
            let res2: any = await performTaskStatus(taskId);
            //
            console.log(res2);
            if (res2 && res2.result_code == 2) {
                //完成, 更新Message
                setResult(JSON.parse(res2.result));
                //
                setProgress('completed');
            } else {
                setStdout(res2.stdout.split('\n'));
                setStderr(res2.stderr.split('\n'));

                if (timeoutHandle !== null) {
                    clearTimeout(timeoutHandle);
                    timeoutHandle = null;
                }
                // timeoutHandle = setTimeout(async () => {
                //     await queryTaskStatus(taskId, message);
                // }, 1000);
            }
        } catch (error) {
            console.error(error);
            //查询不到该任务，异常
            // await updateTaskMessage(message.id, "", "fail");
        }
    };

    const contentElement = (progress: 'empty' | 'waiting' | 'completed' | 'fail', taskId: string | null, message: MessageEntity, images: Array<string>) => {
        if (progress === 'empty') {
            return (
                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', 'alignItems': 'center', justifyContent: 'center' }}>
                    <Empty description={'请在左侧运行任务'} />
                </div>
            );
        } else if (progress === 'waiting') {
            if (taskId != null) {
                if (timeoutHandle !== null) {
                    clearTimeout(timeoutHandle);
                    timeoutHandle = null;
                }
                timeoutHandle = setTimeout(async () => {
                    await queryTaskStatus(taskId, message);
                }, 10000);
            }

            //
            return (
                <div data-tauri-drag-region className={classnames(styles.content)} style={{ display: 'flex', flexDirection: 'column', 'alignItems': 'center', justifyContent: 'center' }}>
                    <Spin tip="Loading" size="large">
                        <div className={styles.spin_content} />
                    </Spin>
                    <Row>
                        <Col span={24}>
                            <TaskLogView logs={stdout}></TaskLogView>
                        </Col>
                        <Col span={24}>
                            <TaskLogView logs={stderr}></TaskLogView>
                        </Col>
                    </Row>
                </div>
            );
        } else if (progress === 'completed') {
            return (
                <ImageCarouselViewer
                    className={classnames(styles.content)}
                    conversation={conversation}
                    conversationId={conversationId}
                    images={images.map((item, index) => {
                        return {
                            src: 'rrfile://localhost' + item,
                            // src: 'rrfile://ipfs/QmdLuUuPRHpnQSV8iC4HVdpjjVF3Gsb3c3CVSR84fGXp7S?filename=3f298d37-9a69-459a-8f4e-ac7e0c9e9a3b.jpeg',
                            width: 512,
                            height: 512,
                        }
                    })}
                ></ImageCarouselViewer>
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
                        {contentElement(progress, runningTaskId, lastMessage!, result)}
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