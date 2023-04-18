import React from 'react';
import classnames from 'classnames';

import styles from './conversation-settings.less';
import { ConversationEntity } from '@/databases';
import { SystemPurposes, SystemPurposeId } from '@/databases/data/purpose';
import { Divider, Button, Switch } from 'antd';
export interface ConversationSettingsProps {
    className?: string;
    conversation: ConversationEntity;
}

export const ConversationSettings: React.FC<ConversationSettingsProps> = ({ className, conversation }) => {

    return (
        <div className={classnames(styles.container, className)}>

            <div className={classnames(styles.item, styles.center)}>
                <div className={classnames(styles.logo)}>{SystemPurposes[conversation.args['purposeId'] as SystemPurposeId].symbol}</div>
            </div>
            <Divider style={{ margin: '12px 0' }} />

            <div className={classnames(styles.item)}>
                <label>是否显示系统消息</label>
                <Switch defaultChecked onChange={() => { }} />
            </div>

            <Divider style={{ margin: '12px 0' }} />
            <div className={classnames(styles.item, styles.center)}>
                <Button type="dashed" danger>清空会话记录</Button>
            </div>
        </div>
    );
};

export default ConversationSettings;