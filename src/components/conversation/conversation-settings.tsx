import React, { useState } from 'react';
import classnames from 'classnames';
import { history } from 'umi';
import { ConversationEntity } from '@/databases';
import { SystemPurposes, SystemPurposeId } from '@/databases/data/purpose';
import { Divider, Button, Switch, Input, Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { deleteConversation, clearMessagesByConversationUid, updateConversationArgsByUid, updateConversationNameByUid } from '@/services/index';
const { confirm } = Modal;

import styles from './conversation-settings.less';

export interface ConversationSettingsProps {
    className?: string;
    conversation: ConversationEntity;
    refreshConversation: () => Promise<any>;
    refreshMessages: () => Promise<any>;
    refreshConversationList: (reset: boolean) => Promise<any>;
}

interface _ChatGPTProps {
    conversation: ConversationEntity;
    refreshConversation: () => Promise<any>;
    refreshMessages: () => Promise<any>;
    refreshConversationList: (reset: boolean) => Promise<any>;
}

const _ChatGPT: React.FC<_ChatGPTProps> = ({ conversation, refreshConversation, refreshMessages, refreshConversationList }) => {

    const [name, setName] = useState<string>(conversation.name);

    return (
        <>
            <div className={classnames(styles.item, styles.center)}>
                <div className={classnames(styles.logo)}>{SystemPurposes[conversation.args['purposeId'] as SystemPurposeId].symbol}</div>
            </div>
            <Divider style={{ margin: '4px 0' }} />
            <div className={classnames(styles.item, styles.column)}>
                <label>会话名称</label>
                <Input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                }} onBlur={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    let cname = e.target.value;
                    //校验会话名称
                    if (cname.length > 64) {
                        Modal.error({
                            title: '',
                            content: '会话名称过长,请重新编辑~',
                        });
                        return;
                    }
                    //保存会话的名称
                    await updateConversationNameByUid(conversation.uid, cname);

                    await refreshConversation();
                }}></Input>
            </div>
            <Divider style={{ margin: '4px 0' }} />
            <div className={classnames(styles.item)}>
                <label>是否显示系统消息</label>
                <Switch defaultChecked checked={conversation.args['SystemMessageShown']} onChange={async (checked, event) => {
                    //
                    //保存会话的名称
                    await updateConversationArgsByUid(conversation.uid, {
                        ...conversation.args,
                        'SystemMessageShown': checked
                    });
                    await refreshConversation();
                    await refreshMessages();
                }} />
            </div>
        </>
    );
}


export const ConversationSettings: React.FC<ConversationSettingsProps> = ({ className, conversation, refreshConversation, refreshMessages, refreshConversationList }) => {

    const conversationType = conversation.category;

    const [loading, setLoading] = useState<boolean>(false);

    const content = (conversationType: string) => {
        if (conversationType === 'chat') {
            return (
                <_ChatGPT conversation={conversation} refreshConversation={refreshConversation} refreshMessages={refreshMessages} refreshConversationList={refreshConversationList}></_ChatGPT>
            );
        }
        return <></>;
    };

    return (
        <div className={classnames(styles.container, className)}>
            {content(conversationType)}
            <Divider style={{ margin: '4px 0' }} />
            <div className={classnames(styles.item, styles.center)}>
                <Button type="link" danger loading={loading} onClick={async () => {
                    //清空会话，提示
                    confirm({
                        title: '确定清空会话记录?',
                        icon: <ExclamationCircleFilled />,
                        content: '清空会话记录后无法恢复!',
                        onOk: async () => {
                            let res = await clearMessagesByConversationUid(conversation.uid);
                            //
                            await refreshMessages();
                        },
                        onCancel: () => {
                            console.log('Cancel');
                        },
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消'
                    });
                }}>清空会话记录</Button>
            </div>
            <Divider style={{ margin: '4px 0' }} />
            <div className={classnames(styles.item, styles.center)}>
                <Button type="link" danger loading={loading} onClick={async () => {
                    //删除会话
                    confirm({
                        title: '确定删除会话?',
                        icon: <ExclamationCircleFilled />,
                        content: '删除会话后无法恢复!',
                        onOk: async () => {
                            let res = await deleteConversation(conversation.uid);
                            //
                            // history.push(`/conversation/${conversation.category}`);
                            await refreshConversationList(true);
                        },
                        onCancel: () => {
                            console.log('Cancel');
                        },
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消'
                    });
                }}>删除会话</Button>
            </div>
        </div>
    );
};

export default ConversationSettings;