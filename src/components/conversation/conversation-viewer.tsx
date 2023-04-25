import { ReactNode, useCallback, useEffect, useState } from 'react';

import { history, useLocation, useParams } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem, SideHeader, MessageList, ComposerFacade, Message } from '@/components/index';
import { ConversationBar, AddConversation } from '@/components/conversation/index';
import { Drawer, Spin } from 'antd';
import { getConversationsByType, createConversation, queryConversationByUid } from '@/services/conversation-service';
import { createChatMessage, getMessageByConversationId } from '@/services/message-service';
import { ConversationSettings } from './conversation-settings';
import { getLocalValue } from '@/utils';

import styles from './conversation-viewer.less';
import { ConversationEntity, MessageEntity } from '@/databases';

export interface ConversationViewerProps {
    className?: string;
    conversationId: string;
    conversationType: string;
    menuFolded?: boolean;
    setMenuFolded?: (menuFolded: boolean) => void;
    refreshConversationList: (reset: boolean) => Promise<any>;
}

export const ConversationViewer: React.FC<ConversationViewerProps> = ({ className, conversationId, conversationType, menuFolded, setMenuFolded, refreshConversationList }) => {

    const [messageVersion, setMessageVersion] = useState<number>(1);

    const [conversation, setConversation] = useState<ConversationEntity | null>(null);

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const [writingMessage, setWritingMessage] = useState<MessageEntity | null>(null);

    const [writing, setWriting] = useState<boolean>(false);

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

    //

    const handleSendMessage = async (userText: string, conversationId: string) => {
        console.log(userText, conversationId);
        setWriting(false);
        setWritingMessage(null);
        //
        if (conversationType == 'chat') {
            let newMessageId = await createChatMessage(conversationId, conversationType, 'user', userText);
            //刷新
            setMessageVersion(new Date().getTime());
            let res = await getMessageByConversationId(conversationId);
            //发送请求
            await runAssistant(conversationId, conversation, res.data);
        }
    };

    const runAssistant = async (conversationId: string, conversation: ConversationEntity, historyMessages: Array<MessageEntity>) => {

        let modelTemperature = .8;
        let modelMaxResponseTokens = 4000;

        const payload: any = {
            model: conversation.args['model'],
            messages: historyMessages.map((msg, index) => ({
                role: msg.botRole,
                content: msg.text,
            })),
            temperature: modelTemperature,
            max_tokens: modelMaxResponseTokens,
        };

        console.log(payload.messages, '====');

        try {

            const requestWebsocket = (payload: any): Promise<any> => {

                return new Promise((resolve, reject) => {
                    let websocket = new WebSocket('wss://wsschat.idns.link/desktop/');

                    //调用接口
                    let incrementalText = '';
                    //payload.messages[payload.messages.length - 1].content
                    websocket.onopen = (evt) => {
                        console.log(evt);
                        setTimeout(() => {
                            websocket.send(JSON.stringify({
                                cmd: "ChatGPT_Text",
                                args: {
                                    "prompt": payload.messages,
                                    "temperature": 0
                                }
                            }));
                        }, 2000);
                    };
                    websocket.onclose = function (evt) {
                    };
                    websocket.onmessage = function (res) {
                        let messageStr = res.data;
                        console.log('接收到的数据:', messageStr, typeof (messageStr));
                        if (!messageStr) {
                            console.error("messageStr为空");
                            return;
                        }
                        let messageObj: any = {};
                        try {
                            messageObj = JSON.parse(messageStr);
                        } catch (error) {
                            console.error("解析json失败");
                            return;
                        }
                        if (messageObj.cmd === 'Error') {
                            //错误
                            resolve(messageStr);
                            return;
                        } else if (messageObj.cmd === 'Response' && messageObj.src !== '') {
                            //普通的命令返回
                            try {
                                //调用处理函数
                                resolve(incrementalText);
                            } catch (error) {
                                console.log(error);
                            }
                        } else if (messageObj.cmd === 'Stream' && messageObj.message !== '') {
                            //Stream
                            try {
                                //调用处理函数
                                incrementalText += messageObj.message;
                                setWritingMessage({
                                    id: 0,
                                    senderType: 'Bot',
                                    senderId: '',
                                    avatar: null,
                                    botRole: 'assistant',
                                    modelId: conversation.args['model'],
                                    modelOptions: JSON.stringify(conversation.args),
                                    text: incrementalText,
                                    typing: false,
                                    purposeId: conversation.args['purposeId'],
                                    cacheTokensCount: 0,
                                    updated: 0,
                                    created: 0
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    };
                    websocket.onerror = function (evt) {
                        reject();
                    };
                });
            };
            setWriting(true);
            try {
                let res = await requestWebsocket(payload);
                console.log(res);
                if (res && res.length > 0) {
                    //保存消息
                    let newMessageId = await createChatMessage(conversationId, conversationType, 'assistant', res);
                    setMessageVersion(new Date().getTime());
                } else {

                }
                //完成
                setWriting(false);
            } catch (error: any) {
                console.log('错误:', error);
                //完成
                setWriting(false);
            }
        } catch (error: any) {
            if (error?.name === 'AbortError') {
                // expected, the user clicked the "stop" button
            } else {
                // TODO: show an error to the UI
                console.error('Fetch request error:', error);
            }
            console.log('错误2:', error);
            //完成
            setWriting(false);
        }
    };

    const handleStopGeneration = () => abortController?.abort();

    if (conversation == null) {
        return (
            <div className={classnames(styles.loading, className)}>
                <Spin />
            </div>
        );
    }

    return (
        <div className={classnames(styles.container, className)}>

            <ConversationBar
                title={conversation == null ? '' : conversation.name} className={styles.bar}
                setSettingsShown={() => {
                    setDrawerOpen(!drawerOpen);
                }} menuFolded={menuFolded} setMenuFold={() => {
                    setMenuFolded && setMenuFolded(!menuFolded);
                }}></ConversationBar>

            <div className={styles.content}>
                {/* 消息列表 */}
                <MessageList
                    className={styles.message_list}
                    systemMessageShown={conversation?.args['SystemMessageShown']}
                    conversationId={conversationId!}
                    conversationType={conversationType}
                    beforeNode={''}
                    afterNode={
                        writing && writingMessage ? (
                            <Message message={writingMessage} appending={true}></Message>
                        ) : ('')
                    }
                    version={messageVersion}
                ></MessageList>

                <ComposerFacade
                    height={300}
                    className={styles.composer}
                    disableSend={!!abortController}
                    conversationType={conversationType!}
                    conversationId={conversationId!}
                    sendMessage={handleSendMessage}
                    stopGeneration={handleStopGeneration}
                ></ComposerFacade>

                <Drawer
                    width={310}
                    placement={"right"}
                    closable={false}
                    onClose={() => {
                        setDrawerOpen(false);
                    }}
                    open={drawerOpen}
                    maskStyle={{
                        opacity: 0
                    }}
                    getContainer={false}
                >
                    <ConversationSettings conversation={conversation} refreshConversation={async () => {
                        await refreshConversation(conversationId);
                    }} refreshMessages={async () => {
                        setMessageVersion(new Date().getTime());
                    }} refreshConversationList={refreshConversationList}></ConversationSettings>
                </Drawer>
            </div>
        </div>
    );
}

export default ConversationViewer;