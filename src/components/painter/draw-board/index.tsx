import React, { useState } from 'react';
import classnames from 'classnames';
import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { RunButton } from '@/components/buttons/index';
import { ClickBoard } from './click-board';
import { ExpertBoard } from './expert-board';
import { SimpleBoard } from './simple-board';
import { ConversationEntity, MessageEntity } from '@/databases';
import { FreedomBoard } from './freedom-board';
import { StableDiffusionText2ImageArgs, StableDiffusionText2ImageArgsDefault } from '../types';

import styles from './index.less';

export interface DrawingBoardProps {
    className?: string;
    conversationId: string;
    conversation: ConversationEntity
}

export const DrawingBoard: React.FC<DrawingBoardProps> = ({ className, conversationId, conversation }) => {

    const [purpose, setPurpose] = useState<'figure' | 'animal' | 'scene'>('figure');

    const [ability, setAbility] = useState<string>('StableDiffusion');

    const [args, setArgs] = useState<StableDiffusionText2ImageArgs>(StableDiffusionText2ImageArgsDefault);

    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `简单描述`,
            children: (
                <SimpleBoard className={classnames(styles.content)} purpose={purpose} initArgs={args} onArgsChange={async (args) => {
                    setArgs(args);
                }}></SimpleBoard>
            ),
        },
        {
            key: '3',
            label: `点选描述`,
            children: (
                <ExpertBoard className={classnames(styles.content)} purpose={purpose}></ExpertBoard>
            ),
        },
        {
            key: '4',
            label: `专业描述`,
            children: (
                <ExpertBoard className={classnames(styles.content)} purpose={purpose}></ExpertBoard>
            ),
        },
    ];

    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.example)}>
                <Button type={'link'}>查看示例</Button>
            </div>
            <Tabs
                centered
                className={classnames(styles.panel)}
                defaultActiveKey="1"
                items={items}
                onChange={onChange} />
            <RunButton className={classnames(styles.run_button)}
                ability={ability}
                args={JSON.stringify(args)}
                onTaskPublished={async (res) => {
                    console.log(res.runningTaskId);
                    //插入会话消息

                }}></RunButton>
        </div>
    );
};

export default DrawingBoard;